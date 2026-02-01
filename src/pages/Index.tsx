const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="text-center p-8">
        <h1 className="mb-4 text-4xl font-bold text-[#d4a846] font-mono tracking-wider">
          ⚔ AVENIDA PAULISTA ⚔
        </h1>
        <p className="text-xl text-[#a0a0b0] mb-8">
          Um adventure textual inspirado no clássico de MSX
        </p>
        <a 
          href="/avenida-paulista.html" 
          className="inline-block px-8 py-4 bg-gradient-to-r from-[#2a2a1a] to-[#1a1a0a] border-2 border-[#d4a846] text-[#d4a846] font-mono text-lg rounded-lg hover:bg-[#d4a846] hover:text-black transition-all duration-300 transform hover:-translate-y-1"
        >
          🎮 JOGAR
        </a>
      </div>
    </div>
  );
};

export default Index;
