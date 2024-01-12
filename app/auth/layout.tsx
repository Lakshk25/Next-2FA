

const AuthLayout = ({
    children
}: { children: React.ReactNode }) => {
    return (
        <div className="flex h-full space-y-5 flex-col items-center justify-center bg-gradient-to-t from-indigo-500 to-blue-500">
            {children}
        </div>
    )
}

export default AuthLayout