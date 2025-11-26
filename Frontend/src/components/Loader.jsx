const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const loader = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 border-4 border-dark-400 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-100 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{loader}</div>;
};

export default Loader;
