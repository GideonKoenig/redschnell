import Icon from "assets/ear.svg";

export default async function App() {
    return (
        <div className="flex h-full w-full select-none flex-col items-center justify-center gap-6 text-text-muted dark:text-dark-text-muted">
            <Icon className="inline-block h-48 w-48 text-menu-hover dark:text-dark-menu-light" />
            <div className="flex flex-col items-center gap-6 rounded-lg border-[4px] border-dashed border-menu-light p-6 dark:border-dark-menu-light">
                <p className="text-lg">
                    <span className="font-bold text-accent-main/70 dark:text-dark-accent-light/70">
                        Upload
                    </span>
                    <span>
                        {" a file by dragging and dropping it onto the page."}
                    </span>
                </p>
                <p>or</p>
                <p className="text-lg">
                    <span className="font-bold text-accent-main/70 dark:text-dark-accent-light/70">
                        Create
                    </span>
                    <span>
                        {" a new chat from one of your uploaded files."}
                    </span>
                </p>
            </div>
        </div>
    );
}
