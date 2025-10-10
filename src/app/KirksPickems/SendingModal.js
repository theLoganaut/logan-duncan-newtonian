// components/SendingModal.js
export default function SendingModal({ visible, status }) {
  if (!visible) return null;

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-gray-800 border-t-transparent rounded-full"></div>
            <span className="ml-2">Sending to Kirk...</span>
          </>
        );
      case "success":
        return <span>✅ Sent to Kirk!</span>;
      case "error":
        return <span className="text-red-600">❌ Failed to send! Try again in a few minutes.</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-xl flex items-center shadow-md min-w-[200px] justify-center text-black text-sm font-medium text-center">
        {renderContent()}
      </div>
    </div>
  );
}
