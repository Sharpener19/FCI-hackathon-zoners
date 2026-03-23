import { MessageSquare, Eye, ArrowUp, CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { Question } from '../../types/qa';

interface QuestionListProps {
  questions: Question[];
  sortBy: 'recent' | 'votes' | 'unanswered';
  onSortChange: (sort: 'recent' | 'votes' | 'unanswered') => void;
  onSelectQuestion: (question: Question) => void;
}

export function QuestionList({ questions, sortBy, onSortChange, onSelectQuestion }: QuestionListProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-slate-900">
          {questions.length} Question{questions.length !== 1 ? 's' : ''}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('recent')}
          >
            Recent
          </Button>
          <Button
            variant={sortBy === 'votes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('votes')}
          >
            Most Voted
          </Button>
          <Button
            variant={sortBy === 'unanswered' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSortChange('unanswered')}
          >
            Unanswered
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-500">No questions found. Try adjusting your search or filters.</p>
          </Card>
        ) : (
          questions.map((question) => (
            <Card
              key={question.id}
              className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectQuestion(question)}
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                  <div className="flex items-center gap-1 text-slate-600">
                    <ArrowUp className="w-4 h-4" />
                    <span className="font-medium">{question.votes}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${question.isAnswered ? 'text-green-600' : 'text-slate-500'}`}>
                    {question.isAnswered && <CheckCircle className="w-4 h-4" />}
                    <span className="text-sm">{question.answers.length}</span>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{question.views}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-slate-900 hover:text-blue-600 transition-colors">
                      {question.title}
                    </h3>
                    {question.isAnswered && (
                      <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
                        Answered
                      </Badge>
                    )}
                  </div>

                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {question.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <img
                        src={question.author.avatar}
                        alt={question.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{question.author.name}</span>
                      <span className="text-slate-400">•</span>
                      <span>{formatTimeAgo(question.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
