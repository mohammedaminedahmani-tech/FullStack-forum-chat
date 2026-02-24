import ChatGlobalContainer from "../components/ChatGlobalContainer"; // Assurez-vous que ce composant existe

const SettingsPage = () => {
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <div className="flex-1 flex flex-col overflow-auto">
              <ChatGlobalContainer /> {/* Appel du composant qui gère tout */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
