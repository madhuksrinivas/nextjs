import ClientDemo from "@/components/ClientDemo";
import DataFetchingDemo from "@/components/DataFetchingDemo";
import RSCDemo from "@/components/RSCDemo";
import ServerActionsDemo from "@/components/ServerActionsDemo";
import UsePromiseDemo from "@/components/UsePromisesDemo";
import { Suspense } from "react";
import fs from "node:fs/promises";
import ErrorBoundary from "@/components/ErrorBoundary";

export default async function Home() {
  const fetchUsersPromise = new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const data = await fs.readFile("dummy-db1.json", "utf-8");
        const users = JSON.parse(data);
        resolve(users);
      } catch (error) {
        reject(error);
      }
    }, 2000);
  });
  return (
    <main>
      <RSCDemo />
      <ClientDemo>
        <RSCDemo />
      </ClientDemo>
      <DataFetchingDemo />
      <ServerActionsDemo />
      <ErrorBoundary fallback="Something went wrong!">
        <Suspense fallback={<div>Loading...</div>}>
          <UsePromiseDemo usersPromise={fetchUsersPromise} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
