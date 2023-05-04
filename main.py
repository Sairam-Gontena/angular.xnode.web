import pip
pip.main(['install', 'azure-devops == 7.1.0b3'])
pip.main(['install', 'azure-identity'])
from azure.devops.connection import Connection
from azure.devops.v7_1.git import GitRepositoryCreateOptions
from msrest.authentication import BasicAuthentication
import logging,os,base64,requests,argparse


class ADOUtility:
    """Azure Repos Utility"""
    def __init__(self,org_name,pat,proj_name,repo_name):
        self.org_url = f"https://dev.azure.com/{org_name}"
        self.pat=pat
        self.proj_name=proj_name
        self.repo_name=repo_name

    def create_repo(self,git_client):
        """Creation of Azure Repository"""
        repo_options = GitRepositoryCreateOptions(name=self.repo_name)
        azure_repo = git_client.create_repository(repo_options, project=self.proj_name)
        repo={
            "repo_name" : self.repo_name,
            "repo_id" : azure_repo.id,
            "git_remote_url" : azure_repo.remote_url,
            "web_url": azure_repo.url,
            "ssh_url": azure_repo.ssh_url
        }
        return repo

    def push_code(self,loc,git_client):
        """Pusch Code"""
        changes = []
        for root, dirs, files in os.walk(loc):
            for file in files:
                file_path = os.path.join(root, file)
                with open(file_path, "rb") as fs:
                    content = fs.read()
                    change = {
                                "changeType": "add",
                                "item": {
                                    "path": file_path.split("\1\s")[-1].replace('\\','/')
                                },
                                "newContent": {
                                    "content":  base64.b64encode(content).decode(),
                                    "contentType": "base64Encoded"
                                }
                            }
                    changes.append(change)
                print(change)
        if changes:
            repository = git_client.get_repository(repo_details['repo_id'])
            branch_name = "automated-dev"
            commit_message = "initial commit"
            commit = {"comment": commit_message, "changes": changes}
            branch_url = f"{self.org_url}/{self.proj_name}/_apis/git/repositories/{repository.name}/refs?filter=heads/{branch_name}&api-version=6.1-preview.1"
            headers = {"Authorization": f"Basic {base64.b64encode(b'PAT:' + self.pat.encode()).decode()}"}
            response = requests.get(branch_url, headers=headers)
            response_data = response.json()
            commit = {"comment": commit_message, "changes": changes}
            try :
                body = {"refUpdates": [{"name": f"refs/heads/{branch_name}", "oldObjectId": '0000000000000000000000000000000000000000'}], "commits": [commit]}
                push_url = f"{self.org_url}/_apis/git/repositories/{repository.id}/pushes?api-version=5.1"
                response = requests.post(push_url, headers=headers, json=body)
                response_data = response.json()
                print(response_data)
                print(response.status_code,response.text)
                if response.status_code == 200 or response.status_code == 201:
                    push_details ={
                        "commit_branch": branch_name,
                        "commit_id":response_data['commits'][0]['commitId'],
                        "commited_by":response_data['commits'][0]['committer']['email'],
                        "commited_on":response_data['commits'][0]['committer']['date'],
                        "commit_url":response_data['commits'][0]['url']
                    }
                return push_details
            except Exception:
                branch_name = "automated-dev-temp"
                body = {"refUpdates": [{"name": f"refs/heads/{branch_name}", "oldObjectId": '0000000000000000000000000000000000000000'}], "commits": [commit]}
                push_url = f"{self.org_url}/_apis/git/repositories/{repository.id}/pushes?api-version=5.1"
                response = requests.post(push_url, headers=headers, json=body)
                response_data = response.json()
                print(response_data)
                print(response.status_code,response.text)
                if response.status_code == 200 or response.status_code == 201:
                    push_details ={
                        "commit_branch": branch_name,
                        "commit_id":response_data['commits'][0]['commitId'],
                        "commited_by":response_data['commits'][0]['committer']['email'],
                        "commited_on":response_data['commits'][0]['committer']['date'],
                        "commit_url":response_data['commits'][0]['url']
                    }
                    logging.warning(f"create a new temporary branch {branch_name}. Raise a Pull Request to Merge and Delete the branch after Merge")
                return push_details
        else:
            return "No Changes to Push"


    def ado_auth(self):
        """Initialize Authentication with ADO"""
        credentials = BasicAuthentication('', self.pat)
        connection = Connection(base_url=self.org_url, creds=credentials)
        return connection


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-o", "--orgname", help = "ADO Organization Name")
    parser.add_argument("-p", "--projname", help = "ADO Project Name")
    parser.add_argument("-r", "--reponame", help = "ADO Repository Name")
    parser.add_argument("-t", "--pat", help = "ADO Personal Access Token")
    parser.add_argument("-f", "--fileloc",help = "Directory Path to Push to Repos")
    args = parser.parse_args()
    print("############### File Location #####################")
    print(args.fileloc)
    ado = ADOUtility(org_name=args.orgname,pat=args.pat,
                     proj_name=args.projname,repo_name=args.reponame)
    conn = ado.ado_auth()
    git_client = conn.clients_v7_1.get_git_client()
    repositories = git_client.get_repositories(args.projname)
    repo_names = []
    for repo in repositories:
        repo_names.append(repo.name)
    if args.reponame not in repo_names:
        repo_details = ado.create_repo(git_client=git_client)
    else:
        logging.warning("Repository Already Available with give name")
        for repo in repositories:
            if repo.name == 'Test':
                repo_details={
                    "repo_name" : repo.name,
                    "repo_id" : repo.id,
                    "git_remote_url" : repo.remote_url,
                    "web_url": repo.url,
                    "ssh_url": repo.ssh_url
                }
    res = ado.push_code(git_client=git_client,loc=args.fileloc)
    print(res)


# py main.py -o "SalientMinds" -p "xnode" -t "fjlqvmpf44ekpd5ghfs7j7zjvi3mi4duajykamwwq6dcophm4isq" -r "Test" -l "D:\My Files\Python\Product_dev\LogExporter\loggerapi"