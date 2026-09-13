interface Props {
  params: {
    attemptId: string;
  };
}

export default function Page({ params }: Props) {
  return (
    <main>
      <h1 className="text-2xl font-bold">
        Attempt Workspace
      </h1>

      <p>
        Attempt ID: {params.attemptId}
      </p>
    </main>
  );
}
