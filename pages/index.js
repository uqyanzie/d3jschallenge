import { useSession, signIn, signOut } from "next-auth/react";
import Dashboard from "./dashboard";

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "authenticated") {
    return (
      <section className="grid h-screen place-items-center">
        <div className="max-w-10xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-white-700">
          <h2 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-500">
            Hi {session?.user?.name}
          </h2>
          <br />
          <p className="mb-3 text-3xl font-normal text-gray-700 dark:text-gray-400">
            You are signed in as {session?.user?.email}.
          </p>
          <Dashboard />
          <br />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
            Logout
          </button>
        </div>
      </section>
    );
  }
  return (
    <section className="grid h-screen place-items-center">
      <div
        className="max-w-8xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome To D3-B JavaSript Arc Diagram Demo!
        </h2>
        <br />
        <p className="mb-3 text-3xl font-normal text-gray-700 dark:text-gray-400">
          You currently not authenticated. Click the login button to get
          started!
        </p>
        <button
          type="button"
          onClick={() => signIn()}
          style={{ fontSize: "20px" }}
          className="inline-flex items-center px-3 py-3 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          Login
        </button>
      </div>
      <p className="mb-1 text-2xl p-5 font-normal text-gray-700 dark:text-gray-400">
        Copyright D3-B . Uqy-Diaz-Reyna-Hafidh.
      </p>
    </section>
  );
}
