import { JobPostingHeader } from "@/components/job-posting/JobPostingHeader"
import { JobPostingContainer } from "@/components/job-posting/JobPostingContainer"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <JobPostingHeader />
          <ErrorBoundary>
            <JobPostingContainer />
          </ErrorBoundary>
        </div>
      </main>
      <Toaster />
    </ThemeProvider>
  )
}