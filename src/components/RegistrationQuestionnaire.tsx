const image_0a8941b2087eed40bd6e51fc272ab77d922aeb28 = "/assets/0a8941b2087eed40bd6e51fc272ab77d922aeb28.png";
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, FileText, Building, User, CheckCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    value: string;
    description?: string;
  }[];
}

interface QuestionnaireResult {
  formType: 'IN-01' | 'RF-01';
  formName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface RegistrationQuestionnaireProps {
  onBack: () => void;
  onComplete: (result: QuestionnaireResult) => void;
}

const questions: Question[] = [
  {
    id: 'q1',
    text: 'Are you an individual or sole proprietor?',
    options: [
      { 
        text: 'Yes', 
        value: 'yes',
        description: 'I am registering as an individual or sole proprietor'
      },
      { 
        text: 'No', 
        value: 'no',
        description: 'I am not an individual or sole proprietor'
      }
    ]
  },
  {
    id: 'q2',
    text: 'Is your entity a corporation, partnership, or NGO?',
    options: [
      { 
        text: 'Yes', 
        value: 'yes',
        description: 'My entity is a corporation, partnership, or NGO'
      },
      { 
        text: 'No', 
        value: 'no',
        description: 'My entity is not a corporation, partnership, or NGO'
      }
    ]
  },
  {
    id: 'q3',
    text: 'Single-person business without LBR certificate?',
    options: [
      { 
        text: 'Yes', 
        value: 'yes',
        description: 'I operate a single-person business without LBR certificate'
      },
      { 
        text: 'No', 
        value: 'no',
        description: 'I have an LBR certificate or this does not apply'
      }
    ]
  },
  {
    id: 'q4',
    text: 'Legal structure with articles of incorporation?',
    options: [
      { 
        text: 'Yes', 
        value: 'yes',
        description: 'My business has formal articles of incorporation'
      },
      { 
        text: 'No', 
        value: 'no',
        description: 'My business does not have articles of incorporation'
      }
    ]
  },
  {
    id: 'q5',
    text: 'Voluntary registration below LRD 3,000,000?',
    options: [
      { 
        text: 'Yes (Individual)', 
        value: 'yes-individual',
        description: 'Yes, registering voluntarily as an individual below threshold'
      },
      { 
        text: 'Yes (Business)', 
        value: 'yes-business',
        description: 'Yes, registering voluntarily as a business below threshold'
      },
      { 
        text: 'No', 
        value: 'no',
        description: 'No, my turnover is above LRD 3,000,000 or this does not apply'
      }
    ]
  }
];

export default function RegistrationQuestionnaire({ onBack, onComplete }: RegistrationQuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { getInlineStyles } = useTheme();
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const determineFormType = (answers: Record<string, string>): QuestionnaireResult => {
    // Q1: Are you an individual or sole proprietor?
    if (answers.q1 === 'yes') {
      return {
        formType: 'IN-01',
        formName: 'Individual Registration Form',
        description: 'For individuals/sole proprietors; simpler process.',
        icon: <User className="h-8 w-8" />,
        color: 'green'
      };
    }

    // Q2: Is your entity a corporation, partnership, or NGO?
    if (answers.q2 === 'yes') {
      return {
        formType: 'RF-01',
        formName: 'Organization Registration Form',
        description: 'For formal entities; requires legal documents.',
        icon: <Building className="h-8 w-8" />,
        color: 'blue'
      };
    }

    if (answers.q2 === 'no') {
      return {
        formType: 'IN-01',
        formName: 'Individual Registration Form',
        description: 'Likely an individual/sole proprietor.',
        icon: <User className="h-8 w-8" />,
        color: 'green'
      };
    }

    // Q3: Single-person business without LBR certificate?
    if (answers.q3 === 'yes') {
      return {
        formType: 'IN-01',
        formName: 'Individual Registration Form',
        description: 'Informal sole proprietors use IN-01.',
        icon: <User className="h-8 w-8" />,
        color: 'green'
      };
    }

    // Q4: Legal structure with articles of incorporation?
    if (answers.q4 === 'yes') {
      return {
        formType: 'RF-01',
        formName: 'Organization Registration Form',
        description: 'For corporations/partnerships.',
        icon: <Building className="h-8 w-8" />,
        color: 'blue'
      };
    }

    if (answers.q4 === 'no') {
      return {
        formType: 'IN-01',
        formName: 'Individual Registration Form',
        description: 'Default to individual/sole proprietor.',
        icon: <User className="h-8 w-8" />,
        color: 'green'
      };
    }

    // Q5: Voluntary registration below LRD 3,000,000?
    if (answers.q5 === 'yes-individual') {
      return {
        formType: 'IN-01',
        formName: 'Individual Registration Form',
        description: 'Requires fixed address, bank account.',
        icon: <User className="h-8 w-8" />,
        color: 'green'
      };
    }

    if (answers.q5 === 'yes-business') {
      return {
        formType: 'RF-01',
        formName: 'Organization Registration Form',
        description: 'Subject to LRA approval.',
        icon: <Building className="h-8 w-8" />,
        color: 'blue'
      };
    }

    // Default fallback
    return {
      formType: 'IN-01',
      formName: 'Individual Registration Form',
      description: 'Based on prior answers.',
      icon: <User className="h-8 w-8" />,
      color: 'green'
    };
  };

  const getNextQuestionIndex = (currentIndex: number, answer: string): number => {
    const questionId = questions[currentIndex].id;
    
    switch (questionId) {
      case 'q1':
        if (answer === 'yes') {
          // Skip to end - IN-01 form
          return questions.length;
        } else {
          // Go to Q2
          return 1;
        }
      
      case 'q2':
        if (answer === 'yes') {
          // Skip to end - RF-01 form
          return questions.length;
        } else {
          // Go to Q3
          return 2;
        }
      
      case 'q3':
        if (answer === 'yes') {
          // Skip to end - IN-01 form
          return questions.length;
        } else {
          // Go to Q4
          return 3;
        }
      
      case 'q4':
        if (answer === 'yes') {
          // Skip to end - RF-01 form
          return questions.length;
        } else {
          // Go to Q5
          return 4;
        }
      
      case 'q5':
        // Always go to end after Q5
        return questions.length;
      
      default:
        return currentIndex + 1;
    }
  };

  const handleNext = () => {
    const newAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
    setAnswers(newAnswers);
    
    const nextIndex = getNextQuestionIndex(currentQuestionIndex, selectedAnswer);
    
    if (nextIndex >= questions.length) {
      // Complete questionnaire
      const result = determineFormType(newAnswers);
      onComplete(result);
    } else {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer('');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousQuestionId = questions[currentQuestionIndex - 1].id;
      setSelectedAnswer(answers[previousQuestionId] || '');
    } else {
      onBack();
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-blue-50">
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
                <p className="text-sm text-gray-600">GST Registration Questionnaire</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white">
        <div className="container mx-auto px-6">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="h-2 transition-[width] duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                ...getInlineStyles().gradient
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-2xl border border-gray-200 shadow-[0_12px_30px_rgba(30,58,138,0.12)]">
            <CardHeader 
              className="text-center pb-6 rounded-t-xl"
              style={{ 
                ...getInlineStyles().gradient,
                color: 'white'
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <FileText className="h-8 w-8" style={{ color: 'white' }} />
              </div>
              <CardTitle className="text-2xl font-semibold" style={{ color: 'white' }}>
                Registration Assessment
              </CardTitle>
              <p className="mt-2" style={{ color: '#dbeafe' }}>
                Help us determine the right registration path for you
              </p>
            </CardHeader>
            
            <CardContent className="px-8 pb-2">
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                  {currentQuestion.text}
                </h3>
                
                <div className="space-y-3">
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
                      <label
                        htmlFor={`option-${index}`}
                        className={`block p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50 ${
                          selectedAnswer === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                            selectedAnswer === option.value
                              ? 'border-blue-500 bg-blue-500'
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
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t mt-8">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                
                <Button 
                  variant="default"
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  className="flex items-center gap-2"
                >
                  {isLastQuestion ? 'Complete' : 'Next'}
                  {isLastQuestion ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              This questionnaire will determine whether you need to use Form IN-01 (Individual Registration) 
              or Form RF-01 (Organization Registration) based on your business type and structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}