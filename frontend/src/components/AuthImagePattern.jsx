const AuthImagePattern = ({title}) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-600 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <p className="text-base-content/60">{title}</p>
      </div>
    </div>
  )
}

export default AuthImagePattern
