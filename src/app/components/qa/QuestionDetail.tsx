import { ArrowLeft, ArrowUp, ArrowDown, CheckCircle, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import type { Question } from '../../types/qa';

interface QuestionDetailProps {
  question: Question;
  onBack: () => void;
  onVoteQuestion: (questionId: string, delta: number) => void;
  onVoteAnswer: (questionId: string, answerId: string, delta: number) => void;
  onAcceptAnswer: (questionId: string, answerId: string) => void;
  onAddAnswer: (questionId: string, content: string) => void;
}

export function QuestionDetail({
  question,
  onBack,
  onVoteQuestion,
  onVoteAnswer,
  onAcceptAnswer,
  onAddAnswer
}: QuestionDetailProps) {
  const [answerContent, setAnswerContent] = useState('');
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleVote = (id: string, delta: number, isQuestion = false) => {
    const currentVote = userVotes[id] || 0;
    
    // Can't vote in the same direction twice
    if (currentVote === delta) return;
    
    const actualDelta = currentVote === 0 ? delta : delta * 2;
    setUserVotes({ ...userVotes, [id]: delta });
    
    if (isQuestion) {
      onVoteQuestion(question.id, actualDelta);
    } else {
      onVoteAnswer(question.id, id, actualDelta);
    }
  };

  const handleSubmitAnswer = () => {
    if (answerContent.trim()) {
      onAddAnswer(question.id, answerContent);
      setAnswerContent('');
    }
  };

  const sortedAnswers = [...question.answers].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return b.votes - a.votes;
  });

  return (
    <div className="max-w-4xl">
      <Button variant="ghost" onClick={onBack} className="mb-4 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to questions
      </Button>

      <Card className="p-8 mb-6">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(question.id, 1, true)}
              className={userVotes[question.id] === 1 ? 'text-orange-600' : ''}
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
            <span className="text-xl font-medium text-slate-900">{question.votes}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(question.id, -1, true)}
              className={userVotes[question.id] === -1 ? 'text-orange-600' : ''}
            >
              <ArrowDown className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-slate-900 mb-2">{question.title}</h1>
              {question.isAnswered && (
                <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
                  Answered
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-slate-700 mb-6 whitespace-pre-wrap">{question.content}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-500">
                Asked {formatTimeAgo(question.createdAt)} • {question.views} views
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={question.author.avatar}
                  alt={question.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-sm">
                  <div className="text-slate-900">{question.author.name}</div>
                  <div className="text-slate-500">{question.author.reputation} reputation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-slate-600" />
          <h2 className="text-slate-900">
            {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {sortedAnswers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">No answers yet. Be the first to answer!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedAnswers.map((answer) => (
              <Card key={answer.id} className={`p-6 ${answer.isAccepted ? 'border-green-200 bg-green-50/30' : ''}`}>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, 1)}
                      className={userVotes[answer.id] === 1 ? 'text-orange-600' : ''}
                    >
                      <ArrowUp className="w-5 h-5" />
                    </Button>
                    <span className="text-lg font-medium text-slate-900">{answer.votes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, -1)}
                      className={userVotes[answer.id] === -1 ? 'text-orange-600' : ''}
                    >
                      <ArrowDown className="w-5 h-5" />
                    </Button>
                    {!question.isAnswered && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAcceptAnswer(question.id, answer.id)}
                        className="mt-2"
                        title="Accept this answer"
                      >
                        <CheckCircle className={`w-6 h-6 ${answer.isAccepted ? 'text-green-600 fill-green-600' : 'text-slate-400'}`} />
                      </Button>
                    )}
                    {answer.isAccepted && (
                      <div className="mt-2">
                        <CheckCircle className="w-6 h-6 text-green-600 fill-green-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {answer.isAccepted && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 mb-3" variant="outline">
                        ✓ Accepted Answer
                      </Badge>
                    )}
                    
                    <p className="text-slate-700 mb-4 whitespace-pre-wrap">{answer.content}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="text-sm text-slate-500">
                        Answered {formatTimeAgo(answer.createdAt)}
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={answer.author.avatar}
                          alt={answer.author.name}
                          className="w-7 h-7 rounded-full"
                        />
                        <div className="text-sm">
                          <div className="text-slate-900">{answer.author.name}</div>
                          <div className="text-slate-500">{answer.author.reputation} reputation</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-8" />

      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Your Answer</h3>
        <Textarea
          placeholder="Write your answer here... You can use markdown formatting."
          value={answerContent}
          onChange={(e) => setAnswerContent(e.target.value)}
          className="min-h-[200px] mb-4"
        />
        <Button onClick={handleSubmitAnswer} disabled={!answerContent.trim()}>
          Post Your Answer
        </Button>
      </Card>
    </div>
  );
}
