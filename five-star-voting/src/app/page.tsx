import { HeroSection } from "@/components/features/HeroSection";
import { VotingGrid } from "@/components/features/VotingGrid";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { NavBar } from "@/components/layout/NavBar";
import { getCategoriesWithVotes } from "@/lib/data";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { Stage } from "@/models/Settings";
import SubmissionTrigger from "@/components/features/SubmissionTrigger"; // New client wrapper

export const dynamic = 'force-dynamic';

async function getStage(): Promise<Stage> {
  try {
    await dbConnect();
    const settings = await Settings.findOne();
    return settings?.currentStage || 'COLLECTION';
  } catch (e) {
    return 'COLLECTION';
  }
}

export default async function Home() {
  const [categories, stage] = await Promise.all([
    getCategoriesWithVotes(),
    getStage()
  ]);

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30 text-white">
      <LoadingScreen />
      <NavBar />
      <HeroSection />

      {/* 
          Stage Control:
          - COLLECTION: Show Submission Trigger + Grid (read only or votable? User said add clips WHILE allowing votes, so votable)
          - VOTING: Grid only (votable), No submission.
          - RESULTS: Grid (read only), Sorted by votes.
       */}

      <div className="container mx-auto px-6 mb-8">
        {stage === 'COLLECTION' && (
          <SubmissionTrigger categories={categories} />
        )}
        {stage === 'RESULTS' && (
          <div className="p-4 bg-primary/20 border border-primary text-center rounded-xl mb-8">
            <h2 className="text-2xl font-bold text-white">🏆 VOTING CLOSED - RESULTS PHASE 🏆</h2>
          </div>
        )}
      </div>

      {categories.length > 0 ? (
        <VotingGrid
          categories={categories}
          readOnly={stage === 'RESULTS'}
        />
      ) : (
        <div className="container mx-auto px-6 py-20 text-center text-gray-500">
          {stage === 'COLLECTION' ? 'No clips yet. Be the first to submit!' : 'No categories found.'}
        </div>
      )}

      <div className="h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <footer className="py-8 text-center text-sm text-gray-600">
        Made by <a href="https://aahadv.com" target="_blank" className="hover:text-primary transition-colors">Aahad Vakani</a>
      </footer>
    </main>
  );
}
