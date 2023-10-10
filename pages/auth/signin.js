import { useRef, useState } from "react";
import { getProviders, getSession, signIn } from "next-auth/react"
import { useRouter } from "next/router";

const Signin = ({ providers }) => {
    const router = useRouter();

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const _target = e.target;
        const email = _target.email.value;
        const password = _target.password.value;
        const callbackUrl = '/dashboard'
        const result = await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: '/'
        });
        if (result?.error) {
          setError(result.error);
        } else {
          router.push(callbackUrl);
        }
      };
    return (
        <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
            <div
                className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md"
            >
                <div className="p-5 bg-white md:flex-1">
                    <h3 className="my-4 text-2xl font-semibold text-gray-700">Login</h3>
                    {error && (
                        <p>
                            Can&apos;t Log in
                        </p>
                    )}
                    <form  onSubmit={handleSubmit} className="flex flex-col space-y-5">
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                autoFocus
                                className="px-4 py-2 transition text-black duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
                            </div>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="px-4 py-2 transition duration-300 border text-black border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
                            >
                                Log in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Signin
export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
    const providers = await getProviders()
    if (session) {
        return {
            redirect: { destination: "/" },
        };
    }
    return {
        props: {
            providers,
        },
    }
}