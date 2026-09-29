import React from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="m-4">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-expense">
              <AlertTriangle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Something broke while showing this page. Refresh to try again.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium">Error Details</summary>
                <pre className="figures mt-2 overflow-auto rounded-md border border-border bg-muted p-4 text-xs">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => window.location.reload()}
                variant="default"
                size="sm"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
              <Button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                variant="outline"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}