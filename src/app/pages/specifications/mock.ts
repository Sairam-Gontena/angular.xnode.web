export const SPEC_DATA =
    [
        {
            "title": "Introduction",
            "section": [
                {
                    "title": "Purpose",
                    "content": "The purpose of this document is to provide a comprehensive specification for the survey app, detailing its intended functionality, key features, and underlying technical considerations. This document serves as a guide for the development, testing, and deployment of the application, ensuring alignment between stakeholders and clarity on product expectations."
                },
                {
                    "title": "Scope",
                    "content": "This specification covers the survey app for a nonprofit organization in Tamil Nadu. The app will collect test scores and socioeconomic data from over 30 schools and 2500 students. It will then clean and analyze the data, compare it to past years, create charts to showcase improvements or interesting information, and finally display these charts on the organization's website and donor materials."
                },
                {
                    "title": "Audience",
                    "content": [
                        {
                            "title": "Product Development Teams",
                            "content": "Software engineers, UI/UX designers, QA testers, and database administrators."
                        },
                        {
                            "title": "Project Managers and Product Owners",
                            "content": "For direction, prioritization, and alignment."
                        },
                        {
                            "title": "Stakeholders and Investors",
                            "content": "To understand the product's vision and functionality."
                        },
                        {
                            "title": "Technical Writers",
                            "content": "For creating user manuals, help documents, and tutorials based on the specifications provided."
                        },
                        {
                            "title": "Beta Testers and Early Users",
                            "content": "To understand the expected features and provide feedback."
                        }
                    ]
                },
                {
                    "title": "References",
                    "content": [
                        {
                            "title": "Placeholder for Actual Document Name",
                            "content": "User Research Findings and User Persona Document."
                        },
                        {
                            "title": "Educational Data Collection Guidelines",
                            "content": "Specific guidelines or standards related to collecting educational data."
                        },
                        {
                            "title": "Data Analysis and Visualization Best Practices",
                            "content": "Specific best practices or guidelines for cleaning, analyzing, and visualizing data."
                        },
                        {
                            "title": "Web Development Framework Documentation",
                            "content": "Documentation for the web development framework to be used for website integration."
                        },
                        {
                            "title": "Donor Material Design Guidelines",
                            "content": "Specific design guidelines or standards for creating donor materials."
                        }
                    ]
                }
            ],
            "created_on": "2023-09-27 09:13:46",
            "modified_on": "2023-09-27 09:13:46",
            "created_by": "sohail.shroff@salientminds.com",
            "modified_by": "sohail.shroff@salientminds.com"
        },
        {
            "title": "Product Overview",
            "section": [
                {
                    "title": "Product Perspective",
                    "content": "The survey app for the nonprofit organization in Tamil Nadu aims to streamline the process of conducting surveys across multiple schools and students. It will collect test scores and socioeconomic data, clean and analyze the data, create charts to showcase improvements or interesting information, and display these charts on the organization's website and donor materials."
                },
                {
                    "title": "Product Functions",
                    "content": [
                        {
                            "title": "Survey Creation and Management",
                            "content": "Allows users to create and manage surveys for schools and students."
                        },
                        {
                            "title": "Data Collection and Storage",
                            "content": "Collects and stores test scores and socioeconomic data from over 30 schools and 2500 students."
                        },
                        {
                            "title": "Data Cleaning and Analysis",
                            "content": "Cleans and analyzes the collected data to identify trends and insights."
                        },
                        {
                            "title": "Chart Creation and Visualization",
                            "content": "Creates charts to showcase improvements or interesting information."
                        },
                        {
                            "title": "Website Integration",
                            "content": "Integrates with the organization's website to display the created charts."
                        },
                        {
                            "title": "Donor Material Generation",
                            "content": "Generates materials for donors that include the created charts."
                        },
                        {
                            "title": "Timely Notifications",
                            "content": "Sends notifications to users based on specific events or triggers."
                        },
                        {
                            "title": "Issue Tracker",
                            "content": "Tracks and manages issues reported by users."
                        }
                    ]
                },
                {
                    "title": "UserClasses Characteristics",
                    "content": [
                        {
                            "title": "Teachers",
                            "content": "Interact with the survey app to conduct surveys and provide feedback."
                        },
                        {
                            "title": "Administrators",
                            "content": "Use the survey app to manage surveys and access the collected data."
                        },
                        {
                            "title": "Students",
                            "content": "Participate in surveys and provide their test scores and socioeconomic data."
                        },
                        {
                            "title": "Donors",
                            "content": "View the generated materials and charts to understand the organization's progress."
                        }
                    ]
                }
            ],
            "created_on": "2023-09-27 09:14:15",
            "modified_on": "2023-09-27 09:14:15",
            "created_by": "sohail.shroff@salientminds.com",
            "modified_by": "sohail.shroff@salientminds.com"
        },

    ];

export const COMMENTS = [
    {
        "CreatedBy": {
            "Id": "user123",
            "DisplayName": "john_doe",
            Email: "test"
        },
        "CreatedOn": new Date(),
        "ModifiedBy": {
            "Id": "user123",
            "DisplayName": "john_doe",
            Email: "test"
        },
        "ModifiedOn": new Date(),
        "id": "comment123",
        "content_id": "content456",
        "product_id": "product789",
        "content": [{
            "title": "References",
            "content": [
                {
                    "title": "Real-time Order Tracking",
                    "content": "https://example.com/real-time-order-tracking"
                },
                {
                    "title": "Order Status Updates",
                    "content": "https://example.com/order-status-updates"
                },
                {
                    "title": "Customer Support Integration",
                    "content": "https://example.com/customer-support-integration"
                },
                {
                    "title": "Logistics Systems Integration",
                    "content": "https://example.com/logistics-systems-integration"
                }
            ],
            "id": "12f7769e-f4c3-43d0-a4e5-4fd3c22cda3a",
            "created_on": "2023-10-31 06:49:58",
            "modified_on": "2023-10-31 06:49:58",
            "version": 1,
            "created_by": "arun.ragam@salientminds.com",
            "modified_by": "arun.ragam@salientminds.com"
        }],
        "user_id": "user123",
        "message": "This is a sample comment.",
        "crId": "cr789",
        "linkedCommentIds": ["comment456", "comment789"],
        "attachments": [
            {
                "Id": "user123",
                "Name": "john_doe",
                FilePath: "test"
            },
            {
                "Id": "user123",
                "Name": "john_doe",
                FilePath: "test"
            }
        ],
        "userMentions": [
            {
                "Id": "user123",
                "DisplayName": "john_doe",
                Email: "test"
            },
            {
                "Id": "user123",
                "DisplayName": "john_doe",
                Email: "test"
            }
        ],
        "itemType": "Comment",
        "status": "Resolved"
    }

]