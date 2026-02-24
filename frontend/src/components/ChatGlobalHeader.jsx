const ChatGlobalHeader = () => {
    return (
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Titre du Chat Global */}
            <div>
              <h3 className="font-medium">Public chat for everyone</h3>
              <p className="text-sm text-zinc-400">Chat Global</p> {/* Modifié ici */}
            </div>
          </div>
    
          {/* Close button */}
          {/* Le bouton de fermeture est inutile ici, mais vous pouvez l'ajouter si nécessaire */}
        </div>
      </div>
    );
  };
  
  export default ChatGlobalHeader;
  