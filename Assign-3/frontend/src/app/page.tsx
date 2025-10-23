'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [pat, setPat] = useState('');
  const [dockerfileContent, setDockerfileContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPushButton, setShowPushButton] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setDockerfileContent('');

    try {
      const response = await fetch('http://localhost:8080/api/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl,
          pat,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate Dockerfile');
      }

      setDockerfileContent(data.dockerfile);
      setShowPushButton(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate Dockerfile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushToRepo = async () => {
    setIsPushing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/push-to-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl,
          pat,
          dockerfileContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to push to repository');
      }

      alert('Dockerfile successfully pushed to repository!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to push to repository. Please try again.');
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">DockGen AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repoUrl">GitHub Repository URL</Label>
              <Input
                id="repoUrl"
                type="url"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pat">GitHub Personal Access Token</Label>
              <Input
                id="pat"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !repoUrl || !pat}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                'Generate & Build Image'
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Results Card */}
        {(dockerfileContent || error) && (
          <Card>
            {error ? (
              <CardContent className="pt-6">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Dockerfile</CardTitle>
                    {showPushButton && (
                      <Button 
                        variant="outline" 
                        onClick={handlePushToRepo}
                        disabled={isPushing}
                        className="ml-4"
                      >
                        {isPushing ? (
                          <>
                            <Spinner className="mr-2 h-4 w-4" />
                            Pushing...
                          </>
                        ) : (
                          'Push to Repo'
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={dockerfileContent}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Generated Dockerfile will appear here..."
                  />
                </CardContent>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}