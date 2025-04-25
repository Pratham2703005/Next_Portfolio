export default function Loading() {
    return (
      <div
        className="flex items-center justify-center h-screen w-full relative z-10"
        role="status"
        aria-busy="true"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Loading spinner with matching purple/blue gradient */}
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-b-2 border-l-2 border-blue-500 animate-spin animate-delay-150"></div>
          </div>
  
          {/* Loading text with font from your theme */}
          <p className="text-white font-medium text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  