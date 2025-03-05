import { useRouteError, isRouteErrorResponse } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : undefined;

  return (
    <div className="w-full flex flex-col items-center py-10 gap-4">
      {status == 404 ? (
        <>
          <div className="error-container-message">
            <h1>404</h1>
          </div>
          <p>Hm, it seems you are looking for unicorns</p>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2">
            <h1>Woops!</h1>
            <h1>Something when wrong :(</h1>
          </div>
          <p>Have you try turning it off and on again?</p>
        </>
      )}
    </div>
  );
}

export default ErrorPage;
