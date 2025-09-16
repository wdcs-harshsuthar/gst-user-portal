const image_0a8941b2087eed40bd6e51fc272ab77d922aeb28 = "https://images.unsplash.com/photo-1542376750-0c7f1cb2a1b7?w=400&h=200&fit=crop";
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, FileText, Building, User, CheckCircle, Users, Home, ShoppingCart, Building2 } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    value: string;
    description?: string;
  }[];
  condition?: (answers: Record<string, string>) => boolean;
  skipIf?: (answers: Record<string, string>) => boolean;
}

interface QuestionnaireResult {
  route: 'sole-proprietorship' | 'partnership-corporation' | 'property-only';
  forms: string[];
  formDescription: string;
  registrationStatus: 'new' | 're-registration' | 'modification' | 'closure';
  applicantType: 'sole-proprietor' | 'organization' | 'property-owner';
  hasOwners?: boolean;
  hasBranches?: boolean;
  needsProperty?: boolean;
  icon: React.ReactNode;
  color: string;
}

interface RegistrationQuestionnaireProps {
  onBack: () => void;
  onComplete: (result: QuestionnaireResult) => void;
}

const questions: Question[] = [
  {
    id: 'has-tin',
    text: 'Do you have a TIN number?',
    options: [
      { 
        text: 'Yes', 
        value: 'yes',
        description: 'I have a valid TIN number from LRA'
      },
      { 
        text: 'No', 
        value: 'no',
        description: 'I do not have a TIN number yet'
      }
    ]
  },
  {
    id: 'applicant-type',
    text: 'What type of registration do you need?',
    options: [
      { 
        text: 'Sole Proprietor', 
        value: 'sole-proprietor',
        description: 'I own and operate a business by myself'
      },
      { 
        text: 'Organization', 
        value: 'organization',
        description: 'I am registering for a company, partnership, or organization'
      },
      { 
        text: 'Property Owner', 
        value: 'property-owner',
        description: 'I need to register residential property for tax purposes'
      }
    ],
    condition: (answers) => answers['has-tin'] === 'yes'
  },

  {
    id: 'register-business',
    text: 'Do you want to register or update a Sole Proprietorship business?',
    options: [
      { 
        text: 'Yes', 
        value: 'yes',
        description: 'I want to register my sole proprietorship business for tax purposes'
      },
      { 
        text: 'No', 
        value: 'no',
        description: 'No additional form needed'
      }
    ],
    condition: (answers) => answers['applicant-type'] === 'sole-proprietor'
  },
  {
    id: 'has-owners',
    text: 'Does your Organization have shareholders/partners?',
    options: [
      { 
        text: 'Yes', 
        value: 'yes',
        description: 'My organization has partners, shareholders, or multiple owners'
      },
      { 
        text: 'No', 
        value: 'no',
        description: 'My organization does not have shareholders or partners'
      }
    ],
    condition: (answers) => answers['applicant-type'] === 'organization'
  },
  {
    id: 'has-branches',
    text: 'Does your business/organization have multiple branches?',
    options: [
      { 
        text: 'Yes', 
        value: 'yes',
        description: 'My business operates from multiple locations'
      },
      { 
        text: 'No', 
        value: 'no',
        description: 'Main form is enough'
      }
    ],
    condition: (answers) => {
      const isOrganization = answers['applicant-type'] === 'organization';
      const isSoleProprietorWithBusiness = answers['applicant-type'] === 'sole-proprietor' && answers['register-business'] === 'yes';
      return isOrganization || isSoleProprietorWithBusiness;
    }
  },
  {
    id: 'declare-property',
    text: 'Are you declaring ownership of residential property for tax purposes?',
    options: [
      { 
        text: 'Yes', 
        value: 'yes',
        description: 'I need to declare residential property'
      },
      { 
        text: 'No', 
        value: 'no',
        description: 'Skip property declaration'
      }
    ],
    condition: (answers) => answers['applicant-type'] !== 'property-owner'
  }
];

export default function RegistrationQuestionnaire({ onBack, onComplete }: RegistrationQuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [questionPath, setQuestionPath] = useState<number[]>([0]);
  const [showTinMessage, setShowTinMessage] = useState(false);

  const getRelevantQuestions = () => {
    return questions.filter(question => {
      // Skip questions that have a skipIf condition that returns true
      if (question.skipIf && question.skipIf(answers)) {
        return false;
      }
      // Include questions that have no condition or whose condition is met
      return !question.condition || question.condition(answers);
    });
  };

  const relevantQuestions = getRelevantQuestions();
  const currentQuestion = relevantQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === relevantQuestions.length - 1;

  const determineResult = (answers: Record<string, string>): QuestionnaireResult => {
    const applicantType = answers['applicant-type'];
    const hasOwners = answers['has-owners'] === 'yes';
    const hasBranches = answers['has-branches'] === 'yes';
    const registerBusiness = answers['register-business'] === 'yes';
    const declareProperty = answers['declare-property'] === 'yes';


    // Property Owner → Residential Property Owner Form
    if (applicantType === 'property-owner') {
      return {
        route: 'property-only',
        forms: ['Residential Property Declaration'],
        formDescription: 'Residential Property Owner Form',
        registrationStatus: 'new',
        applicantType: 'property-owner',
        needsProperty: true,
        icon: <Home className="h-8 w-8" />,
        color: 'green'
      };
    }

    // Sole Proprietor → Q2 flow
    if (applicantType === 'sole-proprietor') {
      let forms: string[] = [];
      let description = '';

      if (registerBusiness) {
        // Yes → SP01 (+ BR01 if multiple branches)
        forms.push('SP01');
        description = 'SP01 (Sole Proprietorship)';
        
        if (hasBranches) {
          forms.push('BR01');
          description += ' + BR01 for each additional branch';
        }


      } else {
        // No → No additional form needed
        description = 'No additional form needed';
      }

      if (declareProperty) {
        forms.push('Residential Property Declaration');
        description += forms.length > 1 ? ' + Residential Property Owner Form' : 'Residential Property Owner Form only';
      }

      return {
        route: 'sole-proprietorship',
        forms,
        formDescription: description,
        registrationStatus: 'new',
        applicantType: 'sole-proprietor',
        hasBranches: registerBusiness ? hasBranches : false,
        needsProperty: declareProperty,
        icon: <ShoppingCart className="h-8 w-8" />,
        color: 'purple'
      };
    }

    // Organization → Q3 flow
    if (applicantType === 'organization') {
      let forms: string[] = ['RF01'];
      let description = 'RF01 (Business Registration)';

      if (hasOwners) {
        // Yes → RF01 + S01 (+ BR01 if multiple branches)
        forms.push('OS01');
        description += ' + OS01 (Owners/Shareholders)';
      }
      // No → RF01 only (+ BR01 if multiple branches)

      // Q4: Add branches if applicable
      if (hasBranches) {
        forms.push('BR01');
        description += ' + BR01 for each additional branch';
      }



      if (declareProperty) {
        forms.push('Residential Property Declaration');
        description += ' + Residential Property Owner Form';
      }

      return {
        route: 'partnership-corporation',
        forms,
        formDescription: description,
        registrationStatus: 'new',
        applicantType: 'organization',
        hasOwners,
        hasBranches,
        needsProperty: declareProperty,
        icon: <Building className="h-8 w-8" />,
        color: 'orange'
      };
    }

    // Default fallback to sole proprietorship
    return {
      route: 'sole-proprietorship',
      forms: ['SP01', 'Residential Property Declaration'],
      formDescription: 'SP01 (Sole Proprietorship) + Residential Property Owner Form',
      registrationStatus: 'new',
      applicantType: 'sole-proprietor',
      needsProperty: true,
      icon: <ShoppingCart className="h-8 w-8" />,
      color: 'purple'
    };
  };

  const handleNext = () => {
    const newAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
    setAnswers(newAnswers);
    
    // Check if user doesn't have TIN number
    if (currentQuestion.id === 'has-tin' && selectedAnswer === 'no') {
      // Show TIN requirement message instead of proceeding
      setShowTinMessage(true);
      return;
    }
    
    // Early completion conditions based on new flow
    const shouldComplete = 
      isLastQuestion || 
      newAnswers['applicant-type'] === 'property-owner';
    
    if (shouldComplete) {
      // Complete questionnaire
      const result = determineResult(newAnswers);
      onComplete(result);
    } else {
      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestionPath([...questionPath, nextIndex]);
      setSelectedAnswer('');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const newPath = [...questionPath];
      newPath.pop();
      const previousIndex = newPath[newPath.length - 1];
      
      setCurrentQuestionIndex(previousIndex);
      setQuestionPath(newPath);
      
      const previousQuestion = relevantQuestions[previousIndex];
      setSelectedAnswer(answers[previousQuestion.id] || '');
    } else {
      onBack();
    }
  };

  const progress = ((currentQuestionIndex + 1) / relevantQuestions.length) * 100;

  const getQuestionIcon = (questionId: string) => {
    switch (questionId) {
      case 'has-tin':
        return <FileText className="h-6 w-6" />;
      case 'applicant-type':
        return <User className="h-6 w-6" />;
      case 'register-business':
        return <ShoppingCart className="h-6 w-6" />;
      case 'has-owners':
        return <Users className="h-6 w-6" />;
      case 'has-branches':
        return <Building2 className="h-6 w-6" />;
      case 'declare-property':
        return <Home className="h-6 w-6" />;

      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getQuestionNumber = () => {
    switch (currentQuestion.id) {
      case 'has-tin': return 'Q1';
      case 'applicant-type': return 'Q2';
      case 'register-business': return 'Q3';
      case 'has-owners': return 'Q4';
      case 'has-branches': return 'Q5';
      case 'declare-property': return 'Q6';
      default: return `Q${currentQuestionIndex + 1}`;
    }
  };

  // Show TIN message if user doesn't have TIN
  if (showTinMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={image_0a8941b2087eed40bd6e51fc272ab77d922aeb28} 
                  alt="Liberia Coat of Arms" 
                  className="w-60 h-24 rounded-[0px] object-cover mx-[0px] py-[0px] m-[0px] pt-[115px] pb-[--4px] px-[10px] pt-[24px] pr-[10px] pb-[18px] pl-[10px]"
                />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Liberia Revenue Authority</h1>
                  <p className="text-sm text-gray-600">TIN Number Required</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                <div className="flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <CardTitle className="text-center text-2xl">
                  TIN Number Required
                </CardTitle>
                <p className="text-center text-amber-100 mt-2">
                  You must have a TIN number to proceed with GST registration
                </p>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-amber-100 rounded-full p-3">
                        <FileText className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">
                      Get Your TIN Number First
                    </h3>
                    <p className="text-amber-700 mb-4">
                      Before you can register for GST, you need to obtain a Tax Identification Number (TIN) through LRA's offline process.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-2">How to get your TIN:</h4>
                      <ul className="text-left text-amber-700 space-y-1 text-sm">
                        <li>• Visit your nearest LRA office</li>
                        <li>• Bring required identification documents</li>
                        <li>• Complete the TIN application form</li>
                        <li>• Receive your TIN number</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTinMessage(false)}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Question
                  </Button>
                  
                  <Button 
                    onClick={onBack}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
                  >
                    Return to Home
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                <strong>Important:</strong> A valid TIN number is required for all GST registrations in Liberia.
                <br />
                Please visit your nearest LRA office to obtain your TIN before proceeding with GST registration.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={image_0a8941b2087eed40bd6e51fc272ab77d922aeb28} 
                alt="Liberia Coat of Arms" 
                className="w-60 h-24 rounded-[0px] object-cover mx-[0px] py-[0px] m-[0px] pt-[115px] pb-[--4px] px-[10px] pt-[24px] pr-[10px] pb-[18px] pl-[10px]"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Liberia Revenue Authority</h1>
                <p className="text-sm text-gray-600">GST Registration Form Selection</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {getQuestionNumber()} of {relevantQuestions.length} Questions
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white">
        <div className="container mx-auto px-6">
          <div className="w-full bg-gray-200 h-2">
            <div 
              className="bg-primary h-2 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary to-blue-700 text-white">
              <div className="flex items-center justify-center mb-4">
                {getQuestionIcon(currentQuestion.id)}
              </div>
              <CardTitle className="text-center text-2xl">
                Registration Form Selection
              </CardTitle>
              <p className="text-center text-blue-100 mt-2">
                Answer these questions to determine which forms you need to complete
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="mb-8">
                <div className="text-center mb-6">
                  <Badge variant="outline" className="mb-4">
                    {getQuestionNumber()}
                  </Badge>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {currentQuestion.text}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index}>
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="question-answer"
                        value={option.value}
                        checked={selectedAnswer === option.value}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        className="sr-only"
                      />
                      {!(currentQuestion.id === 'applicant-type' && option.value === 'property-owner') && (
                        <label
                          htmlFor={`option-${index}`}
                          className={`block p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary hover:bg-blue-50 ${
                            selectedAnswer === option.value
                              ? 'border-primary bg-blue-50 text-primary font-medium'
                              : 'border-gray-200 bg-white text-gray-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                              selectedAnswer === option.value
                                ? 'border-primary bg-primary'
                                : 'border-gray-300'
                            }`}>
                              {selectedAnswer === option.value && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium mb-1">{option.text}</div>
                              {option.description && (
                                <div className="text-sm text-gray-500">{option.description}</div>
                              )}
                            </div>
                          </div>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  className="flex items-center gap-2"
                >
                  {isLastQuestion || answers['applicant-type'] === 'property-owner' ? 'View Required Forms' : 'Next'}
                  {isLastQuestion || answers['applicant-type'] === 'property-owner' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              This assessment determines which registration forms you need based on Liberian tax requirements.
              <br />
              <strong>Note:</strong> Answer the questions to get your personalized form requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}