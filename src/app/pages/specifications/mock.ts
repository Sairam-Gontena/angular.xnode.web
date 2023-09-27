export const SPEC_DATA = {
    "introduction": {
        "Purpose": "The purpose of this document is to provide a comprehensive specification for the survey app, detailing its intended functionality, key features, and underlying technical considerations. This document serves as a guide for the development, testing, and deployment of the application, ensuring alignment between stakeholders and clarity on product expectations.",
        "Scope": "This specification covers the survey app for a nonprofit organization in Tamil Nadu. The app will collect test scores and socioeconomic data from over 30 schools and 2500 students. It will then clean and analyze the data, compare it to past years, create charts to showcase improvements or interesting information, and finally display these charts on the organization's website and donor materials.",
        "Audience": {
            "Product Development Teams": "Software engineers, UI/UX designers, QA testers, and database administrators.",
            "Project Managers and Product Owners": "For direction, prioritization, and alignment.",
            "Stakeholders and Investors": "To understand the product's vision and functionality.",
            "Technical Writers": "For creating user manuals, help documents, and tutorials based on the specifications provided.",
            "Beta Testers and Early Users": "To understand the expected features and provide feedback."
        },
        "References": {
            "Placeholder for Actual Document Name": "User Research Findings and User Persona Document.",
            "Educational Data Collection Guidelines": "Specific guidelines or standards related to collecting educational data.",
            "Data Analysis and Visualization Best Practices": "Specific best practices or guidelines for cleaning, analyzing, and visualizing data.",
            "Web Development Framework Documentation": "Documentation for the web development framework to be used for website integration.",
            "Donor Material Design Guidelines": "Specific design guidelines or standards for creating donor materials."
        },
        "created_on": "2023-09-26 13:45:14",
        "modified_on": "2023-09-26 13:45:24"
    },
    "product_overview": {
        "Product_Perspective": "The survey app for the nonprofit organization in Tamil Nadu aims to streamline the process of conducting surveys in schools and analyzing the collected data. It will provide a centralized platform for collecting test scores and socioeconomic data from over 30 schools and 2500 students. The app will also clean and analyze the data, compare it to past years, create charts to showcase improvements or interesting information, and display these charts on the organization's website and donor materials.",
        "Product_Functions": {
            "Survey Creation and Management": "Allows users to create and manage surveys for schools and students.",
            "Data Collection and Storage": "Collects and stores test scores and socioeconomic data from over 30 schools and 2500 students.",
            "Data Cleaning and Analysis": "Cleans and analyzes the collected data, comparing it to past years.",
            "Chart Creation and Visualization": "Creates charts to showcase improvements or interesting information.",
            "Website Integration": "Integrates the charts into the organization's website.",
            "Donor Material Generation": "Generates materials for donors, including the charts and other relevant information.",
            "Timely Notifications": "Sends notifications to users based on specific events or triggers.",
            "Issue Tracker": "Tracks and manages issues reported by users."
        },
        "UserClasses_Characteristics": {
            "Teachers": "Interact with the app to conduct surveys and provide feedback.",
            "Administrators": "Manage the survey app and access the collected data.",
            "Students": "Participate in surveys and provide their test scores and socioeconomic data.",
            "Donors": "View the generated charts and other materials to understand the organization's progress."
        },
        "User_Personas": [
            {
                "Name": "John Smith",
                "Age": 35,
                "Occupation": "School Administrator",
                "Backstory": "John is an experienced school administrator who is responsible for managing surveys and collecting data from multiple schools. He wants a user-friendly app that can streamline the survey process and provide meaningful insights.",
                "Needs": "Efficient survey creation and management, data analysis, and easy access to charts and reports.",
                "Quote": "I need a tool that simplifies the survey process and helps me make data-driven decisions."
            },
            {
                "Name": "Sarah Johnson",
                "Age": 28,
                "Occupation": "Teacher",
                "Backstory": "Sarah is a dedicated teacher who wants to actively participate in surveys and provide feedback. She needs a user-friendly app that allows her to easily input data and track the progress of her students.",
                "Needs": "Simple and intuitive survey interface, easy data input, and progress tracking.",
                "Quote": "I want to contribute to the survey process and help improve our educational programs."
            },
            {
                "Name": "Michael Brown",
                "Age": 17,
                "Occupation": "Student",
                "Backstory": "Michael is a high school student who wants to share his test scores and socioeconomic data for the survey. He needs an app that is easy to use and allows him to input his data accurately.",
                "Needs": "User-friendly interface, clear instructions for data input, and privacy protection.",
                "Quote": "I want to contribute to the survey and help improve our school's programs."
            },
            {
                "Name": "Emily Davis",
                "Age": 45,
                "Occupation": "Donor",
                "Backstory": "Emily is a philanthropist who wants to support the nonprofit organization. She needs an app that provides clear and visually appealing charts and materials to understand the impact of her donations.",
                "Needs": "Access to charts and materials showcasing the organization's progress and impact.",
                "Quote": "I want to see how my donations are making a difference in the lives of students."
            }
        ],
        "created_on": "2023-09-26 13:46:24",
        "modified_on": "2023-09-26 13:47:00"
    },
    "functional_specifications": {
        "User_Roles": {
            "Regular User": [
                "Survey Creation",
                "Data Collection",
                "Data Analysis",
                "Chart Creation",
                "Website Integration",
                "Donor Material Generation",
                "Timely Notifications",
                "Issue Tracking"
            ],
            "Admin": [
                "Survey Management",
                "Data Storage",
                "Data Cleaning",
                "Chart Visualization",
                "Website Integration",
                "Donor Material Generation",
                "Timely Notifications",
                "Issue Tracking"
            ]
        },
        "Feature_Descriptions": [
            "Survey Creation: Allows users to create surveys for schools and students",
            "Data Collection: Collects test scores and socioeconomic data from over 30 schools and 2500 students",
            "Data Analysis: Cleans and analyzes the collected data",
            "Chart Creation: Creates charts to showcase improvements or interesting information",
            "Website Integration: Displays charts on the organization's website",
            "Donor Material Generation: Generates materials for donors based on the collected data",
            "Timely Notifications: Sends notifications to users based on feedback",
            "Issue Tracking: Tracks and manages issues reported by users"
        ],
        "Usecases": [
            "Conducting student assessments",
            "Gathering feedback from teachers and parents",
            "Measuring student satisfaction",
            "Evaluating the effectiveness of educational programs",
            "Sending timely notifications based on feedback",
            "Tracking and managing issues reported by users"
        ],
        "User_Interface_Design": [
            "Mockups of the survey creation interface",
            "Wireframes of the data collection and analysis interface",
            "Design of the chart creation and visualization interface",
            "Navigation and controls for the website integration module",
            "Layout and design of the donor material generation module",
            "UI elements for the timely notifications and issue tracking modules"
        ],
        "DataManagement_Persistence": "The survey app will store and retrieve data using a database system. The data will be securely stored and encrypted to ensure data privacy and security.",
        "Workflows": [
            {
                "Workflow": "Survey Creation and Management",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration",
                    "Donor Material Generation",
                    "Timely Notifications",
                    "Issue Tracking"
                ]
            },
            {
                "Workflow": "Data Analysis",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration",
                    "Donor Material Generation",
                    "Timely Notifications",
                    "Issue Tracking"
                ]
            },
            {
                "Workflow": "Chart Creation and Visualization",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Website Integration",
                    "Donor Material Generation",
                    "Timely Notifications",
                    "Issue Tracking"
                ]
            },
            {
                "Workflow": "Website Integration",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Donor Material Generation",
                    "Timely Notifications",
                    "Issue Tracking"
                ]
            },
            {
                "Workflow": "Donor Material Generation",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration",
                    "Timely Notifications",
                    "Issue Tracking"
                ]
            },
            {
                "Workflow": "Timely Notifications",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration",
                    "Donor Material Generation",
                    "Issue Tracking"
                ]
            },
            {
                "Workflow": "Issue Tracking",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration",
                    "Donor Material Generation",
                    "Timely Notifications"
                ]
            }
        ],
        "Business_Rules": [
            {
                "Rule": "Data Cleaning",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage"
                ]
            },
            {
                "Rule": "Chart Creation",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning"
                ]
            },
            {
                "Rule": "Website Integration",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation"
                ]
            },
            {
                "Rule": "Donor Material Generation",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration"
                ]
            },
            {
                "Rule": "Timely Notifications",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration",
                    "Donor Material Generation"
                ]
            },
            {
                "Rule": "Issue Tracking",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration",
                    "Donor Material Generation",
                    "Timely Notifications"
                ]
            }
        ],
        "Functional_Dependencies": [
            {
                "Feature": "Data Collection",
                "Dependencies": [
                    "Survey Creation",
                    "Data Storage"
                ]
            },
            {
                "Feature": "Data Analysis",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning"
                ]
            },
            {
                "Feature": "Chart Creation",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning"
                ]
            },
            {
                "Feature": "Website Integration",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation"
                ]
            },
            {
                "Feature": "Donor Material Generation",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration"
                ]
            },
            {
                "Feature": "Timely Notifications",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration",
                    "Donor Material Generation"
                ]
            },
            {
                "Feature": "Issue Tracking",
                "Dependencies": [
                    "Data Collection",
                    "Data Storage",
                    "Data Cleaning",
                    "Chart Creation",
                    "Website Integration",
                    "Donor Material Generation",
                    "Timely Notifications"
                ]
            }
        ],
        "Reporting_Requirements": [
            "Charts showcasing improvements or interesting information",
            "Monthly reports on survey data",
            "Usage and error reports for administrators"
        ],
        "created_on": "2023-09-26 13:47:56",
        "modified_on": "2023-09-26 13:48:18"
    },
    "technical_specifications": {
        "System_Architecture": {
            "Layers": [
                {
                    "Name": "Front-end (Client Layer)",
                    "Description": "Mobile app interface available for both iOS and Android."
                },
                {
                    "Name": "Business Logic Layer",
                    "Description": "A server-side application to process user data, apply AI insights, and manage integrations."
                },
                {
                    "Name": "Data Storage Layer",
                    "Description": "Databases to securely store user financial data, account settings, and AI insights."
                }
            ]
        },
        "Technology_Stack": {
            "Front-end": "React Native for cross-platform mobile app development.",
            "Backend": "Node.js with Express.js framework for server-side operations.",
            "Database": "PostgreSQL for structured financial data and MongoDB for user profiles and settings.",
            "AI_Processing": "TensorFlow for financial insights and recommendations."
        },
        "Integration_Points": [
            "Bank APIs for real-time transaction data retrieval.",
            "Payment gateways for potential future features like bill payments.",
            "Third-party analytics services for app usage and performance tracking."
        ],
        "Security": {
            "Data_Encryption": "End-to-end encryption for all data transmissions.",
            "Password_Storage": "Secure hashing algorithms (like bcrypt) for password storage.",
            "Authentication": "OAuth2.0 for secure authentication with banks and third-party integrations.",
            "Audits": "Regular security audits and penetration tests to ensure the highest level of security."
        },
        "Performance_Metrics": {
            "Expected_Response_Time": "Below 500ms for critical operations.",
            "Throughput": "Ability to handle 10,000 concurrent users.",
            "Scalability": "Infrastructure set up on cloud services (like AWS) to allow quick scaling based on user growth."
        },
        "Deployment": {
            "Cloud": "Cloud deployment on AWS utilizing EC2 for server operations, RDS for PostgreSQL database, and S3 for backup storage.",
            "CI/CD": "Continuous Integration and Continuous Deployment (CI/CD) setup using Jenkins."
        },
        "Error_Handling": {
            "App_Messages": "User-friendly error messages in the app for common issues (like network failures).",
            "Server_Logs": "Detailed error logs on the server-side for troubleshooting and debugging.",
            "Retry_Mechanisms": "Retry mechanisms in place for failed bank API calls or data fetches."
        },
        "Data_Dictionary": {
            "Entities": [
                {
                    "Name": "Schools",
                    "Attributes": [
                        {
                            "Name": "School_ID",
                            "Type": "Integer"
                        },
                        {
                            "Name": "School_Name",
                            "Type": "String"
                        },
                        {
                            "Name": "Location",
                            "Type": "String"
                        }
                    ]
                },
                {
                    "Name": "Students",
                    "Attributes": [
                        {
                            "Name": "Student_ID",
                            "Type": "Integer"
                        },
                        {
                            "Name": "Student_Name",
                            "Type": "String"
                        },
                        {
                            "Name": "School_ID",
                            "Type": "Integer"
                        }
                    ]
                },
                {
                    "Name": "Teachers",
                    "Attributes": [
                        {
                            "Name": "Teacher_ID",
                            "Type": "Integer"
                        },
                        {
                            "Name": "Teacher_Name",
                            "Type": "String"
                        },
                        {
                            "Name": "School_ID",
                            "Type": "Integer"
                        }
                    ]
                },
                {
                    "Name": "Assessments",
                    "Attributes": [
                        {
                            "Name": "Assessment_ID",
                            "Type": "Integer"
                        },
                        {
                            "Name": "Student_ID",
                            "Type": "Integer"
                        },
                        {
                            "Name": "Score",
                            "Type": "Float"
                        }
                    ]
                },
                {
                    "Name": "Feedback",
                    "Attributes": [
                        {
                            "Name": "Feedback_ID",
                            "Type": "Integer"
                        },
                        {
                            "Name": "Teacher_ID",
                            "Type": "Integer"
                        },
                        {
                            "Name": "Parent_ID",
                            "Type": "Integer"
                        },
                        {
                            "Name": "Feedback_Text",
                            "Type": "String"
                        }
                    ]
                },
                {
                    "Name": "Programs",
                    "Attributes": [
                        {
                            "Name": "Program_ID",
                            "Type": "Integer"
                        },
                        {
                            "Name": "Program_Name",
                            "Type": "String"
                        },
                        {
                            "Name": "Program_Description",
                            "Type": "String"
                        }
                    ]
                }
            ]
        },
        "Data_Quality_Checks": {
            "Data_Completeness": "Ensure all required fields are populated.",
            "Data_Accuracy": "Validate data against predefined rules and constraints.",
            "Data_Consistency": "Check for inconsistencies or discrepancies in data.",
            "Data_Timeliness": "Ensure data is up-to-date and reflects the latest information."
        },
        "created_on": "2023-09-26 13:48:58",
        "modified_on": "2023-09-26 13:48:58"
    },
    "nonfunctional_requirements": {
        "Usability": {
            "Ease of Use": "The survey app should have a user-friendly interface that allows teachers and admins to easily navigate and use its features.",
            "Learnability": "New users should be able to understand how to use the survey app within a short period of time, without the need for extensive training.",
            "Intuitiveness": "The app should provide clear instructions and guidance to users, making it easy for them to complete surveys and access the collected data."
        },
        "Reliability": {
            "Uptime Expectations": "The survey app should have a high uptime, ensuring that it is available for use by teachers and admins whenever they need it.",
            "Mean Time Between Failures (MTBF)": "The app should have a high MTBF, minimizing the occurrence of system failures and ensuring uninterrupted usage."
        },
        "Availability": {
            "Operational Uptime": "The survey app should aim for a high percentage of operational uptime, ensuring that it is accessible to users for the majority of the time.",
            "Scheduled Maintenance": "Any scheduled maintenance or downtime should be communicated to users in advance, minimizing the impact on their usage."
        },
        "Scalability": {
            "Data Growth": "The survey app should be able to handle an increasing amount of data as the number of schools and students using it grows.",
            "User Growth": "The app should be able to accommodate a growing number of users without experiencing performance issues or slowdowns.",
            "Transaction Handling": "As the number of surveys conducted increases, the app should be able to handle a larger volume of transactions without any issues."
        },
        "Maintainability": {
            "Bug Fixes": "Any bugs or issues identified in the survey app should be addressed and fixed in a timely manner to ensure smooth operation.",
            "Updates": "Regular updates and improvements should be made to the app to enhance its functionality and address any user feedback or requirements."
        },
        "Portability": {
            "Cross-platform Compatibility": "The survey app should be compatible with different platforms, such as iOS, Android, and web browsers, allowing users to access it from various devices.",
            "Adaptability": "The app should be adaptable to different environments and systems, allowing for easy deployment and integration with existing infrastructure."
        },
        "created_on": "2023-09-26 13:49:21",
        "modified_on": "2023-09-26 13:49:21"
    },
    "interface_requirements": {
        "User_Interfaces": {
            "GUI Layouts": {
                "Description": "The survey app will have a clean and intuitive GUI layout that allows users to easily navigate through different sections and functionalities. It will have a homepage that displays the main features and options, such as survey creation, data analysis, and chart visualization."
            },
            "Elements": {
                "Description": "Common UI elements in the survey app will include buttons, input fields, dropdown menus, checkboxes, and radio buttons for creating and managing surveys. It will also have tables, charts, and graphs for displaying data analysis and visualization."
            },
            "Colors": {
                "Primary Color": "#004D7F",
                "Highlight Color": "#4DABC0",
                "Background Color": "#EFEFEF",
                "Error and Alert Color": "#D9534F"
            },
            "Styles": {
                "Font": "Roboto",
                "Icon Style": "Minimalistic"
            }
        },
        "Hardware_Interfaces": {
            "Device Compatibility": "The survey app will be compatible with smartphones and tablets running on Android and iOS platforms. It will utilize the device's camera for scanning QR codes or capturing images for data collection purposes.",
            "Sensors": "The app will not have any specific hardware sensor requirements.",
            "Biometrics": "The app will not have any specific biometric integration requirements."
        },
        "Software_Interfaces": {
            "Backend Communication": "The survey app will communicate with a server backend using RESTful API endpoints over HTTPS for secure data transfer. It will send and receive data related to survey creation, data collection, analysis, and visualization.",
            "Third-party Integration": "The survey app may integrate with third-party services or APIs for additional functionalities, such as sending notifications, generating charts, or accessing external data sources.",
            "Push Notifications": "The survey app may utilize push notification services provided by the operating systems (Android and iOS) to send timely notifications to users regarding survey updates, data analysis results, or any other relevant information."
        },
        "created_on": "2023-09-26 13:49:37",
        "modified_on": "2023-09-26 13:49:37"
    },
    "usage": {
        "completion_tokens": 4590,
        "prompt_tokens": 12153,
        "total_tokens": 16743,
        "total_cost_usd": 0.00719
    },
    "user_id": "c29oYWlsLnNocm9mZkBzYWxpZW50bWluZHMuY29t",
    "email": "sohail.shroff@salientminds.com",
    "id": "cd42076f-0a37-4d34-97ca-09f8e7172edc",
    "product_id": "0b398791-1dc2-4fd6-b78b-b73928844e36",
    "version": 1,
    "created_on": "2023-09-26 13:50:11",
    "_rid": "PIp1APN9vGEBAAAAAAAAAA==",
    "_self": "dbs/PIp1AA==/colls/PIp1APN9vGE=/docs/PIp1APN9vGEBAAAAAAAAAA==/",
    "_etag": "\"4b02f688-0000-0100-0000-6513c09c0000\"",
    "_attachments": "attachments/",
    "_ts": 1695793308
}