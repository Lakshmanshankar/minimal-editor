import { Editor } from './editor';

type PageSettingProps = {
    isFullWidth: boolean;
};

export function PageSetting({ isFullWidth }: PageSettingProps) {
    if (isFullWidth) {
        return (
            <div className="w-full max-w-full">
                <Editor />
            </div>
        );
    }
    return (
        <div className="w-full max-w-screen-md mx-auto">
            <Editor />
        </div>
    );
}
