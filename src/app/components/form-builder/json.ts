export const JSON_DOC: any = {
  StudentDevelopmentPlan: {
    StudentInformation: {
      Name: 'STUDENT ONE',
      Grade: '9th Grade',
      Class: 'Biology - Period 1',
      DueDate: '2024-03-17',
    },
    SkillToImprove:
      'Understanding of biology concepts, class participation, and emotional regulation',
    StandardToImprove:
      'Focus on areas LS2.B, LS4.C, LS1.C, and emotional self-awareness',
      TryThis: [
        'Regular study sessions on biology topics',
        'Participation in class discussions to improve engagement',
        'Mindfulness exercises to manage emotional responses in class',
      ],
    ActionPlan: {
      Steps: [
        {
          Order: 1,
          Description: 'Review key biology concepts through online resources',
          Type: 'step',
          Checked: false,
        },
        {
          Order: 2,
          Description: 'Organize a weekly study group with peers',
          Type: 'step',
          Checked: false,
        },
        {
          Order: 3,
          Description:
            'Consult with a counselor for strategies on emotional management',
          Type: 'checkpoint',
          Checked: false,
        },
        {
          Order: 4,
          Description:
            'Present a biology topic in class to enhance understanding and confidence',
          Type: 'assessment',
          Checked: false,
        },
      ],
      Resources: [
        {
          Description: 'Online biology learning tools',
          URL: 'https://www.khanacademy.org/science/biology',
        },
        {
          Description: 'Tips for effective study groups',
          URL: 'https://www.edutopia.org/study-group-tips',
        },
        {
          Description: 'Mindfulness resources for teenagers',
          URL: 'https://www.mindfulschools.org/inspiration/mindfulness-for-teens/',
        },
      ],
    },
    DaysToComplete: 60,
    Notes:
      "This development plan is designed to address STUDENT ONE's academic and emotional needs, utilizing resources and strategies to enhance learning and emotional well-being.",
  },
};
