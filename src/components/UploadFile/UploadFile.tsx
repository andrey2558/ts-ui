import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import Btn from '../Btn/Btn';
import { getErrorAlert } from '../sweetAlert';

export type FileType = {
    fileSize: number;
    mimeType: string;
    relativePath: string;
    url: string;
};
export type UploadFileProps = {
    label?: string;
    url: string;
    maxKilobyteSize?: number;
    headers: {
        authorization: string;
    };
    files: FileType[];
    multiple?: boolean;
    allowedTypes?: string[];
    disabled?: boolean;
    onChange: (data: FileType[]) => void;
    className?: string;
};
const UploadFile: FC<UploadFileProps> = props => {
    const {
        label,
        url,
        maxKilobyteSize = 8192,
        files,
        allowedTypes = ['txt', 'docx', 'doc', 'pdf', 'xls', 'xml', 'xlsx', 'ott', 'otd'],
        disabled,
        onChange,
        children,
        multiple = false,
        className = '',
    } = props;
    const headers = { accept: 'application/json, text/plain, */*', ...props.headers };
    const typesMatches = [
        { mimeTypes: ['image/jpg'], type: 'jpg' },
        { mimeTypes: ['image/jpeg'], type: 'jpeg' },
        { mimeTypes: ['image/png'], type: 'png' },
        { mimeTypes: ['image/gif'], type: 'gif' },
        { mimeTypes: ['image/webp'], type: 'webp' },
        { mimeTypes: ['image/webp'], type: 'webp' },
        { mimeTypes: ['image/svg+xml'], type: 'svg' },
        { mimeTypes: ['image/svg+xml'], type: 'svgz' },
        { mimeTypes: ['application/vnd.oasis.opendocument.text'], type: 'odt' },
        { mimeTypes: ['application/vnd.oasis.opendocument.text-template'], type: 'ott' },
        {
            mimeTypes: ['application/vnd.ms-word', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            type: 'docx',
        },
        { mimeTypes: ['application/msword', 'application/vnd.ms-word'], type: 'doc' },
        { mimeTypes: ['application/pdf'], type: 'pdf' },
        { mimeTypes: ['text/plain'], type: 'txt' },
        { mimeTypes: ['application/vnd.ms-excel'], type: 'xls' },
        { mimeTypes: ['application/xml', 'text/xml'], type: 'xml' },
        {
            mimeTypes: [
                'application/vnd.ms-excel',
                'application/excel',
                'application/msexcel',
                'application/msexcell',
                'application/x-dos_ms_excel',
                'application/x-excel',
                'application/x-ms-excel',
                'application/x-msexcel',
                'application/x-xls',
                'application/xls',
            ],
            type: 'xls',
        },
        { mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], type: 'xlsx' },
    ];
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const isFileLoaded = useMemo(() => {
        return files.length > 0;
    }, [files]);

    const uploadFiles = async (files: any[]): Promise<void> => {
        const promiseList: Promise<FileType | undefined>[] = [];

        Array.prototype.forEach.call(files, (item, index) => {
            const arrayedFileName = item.name.split('.');
            const nameOnly = arrayedFileName.slice(0, -1).join('.');
            const itemType = typesMatches.find(type => type.mimeTypes.includes(item.type))?.type;
            const limitationFileSize = maxKilobyteSize ? item.size <= maxKilobyteSize * 1024 : true;
            if (itemType && allowedTypes.includes(itemType) && limitationFileSize && multiple ? index >= 0 : index === 0) {
                const formData = new FormData();
                formData.append('file', item);
                formData.append('fileName', nameOnly);
                const sendMethod = async () => {
                    const response = await fetch(url, {
                        headers: {
                            ...headers,
                        },
                        method: 'POST',
                        body: formData,
                    });
                    const responseJson = (await response.json()) as FileType;
                    if (response.status === 200) {
                        return responseJson;
                    } else if (400 <= response.status || response.status <= 500) {
                        getErrorAlert({ text: `ошибка ${response.status}`, timer: 10000 });
                    }
                };
                promiseList.push(sendMethod());
            } else {
                getErrorAlert({ text: 'некорректный файл', timer: 10000 });
            }
        });

        setIsUploading(true);
        await Promise.all(promiseList)
            .then(data => {
                const value = data.filter(item => item) as FileType[];
                onChange(value);
            })
            .catch(error => console.log(error))
            .finally(() => setIsUploading(false));
    };
    const deleteFile = (index: number): void => onChange(files.filter((v, i) => i !== index));
    const dropArea = useRef((null as unknown) as HTMLDivElement);
    const fileInput = useRef(null);
    useEffect(() => {
        const current = dropArea.current;

        const preventDefaults = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
        };
        const highlight = () => {
            current.classList.add('highlight');
        };
        const unhighlight = () => {
            current.classList.remove('highlight');
        };
        const handleDrop = async (e: any): Promise<void> => {
            const dt = e.dataTransfer;
            const files = dt.files;
            await uploadFiles(files);
        };

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            current.addEventListener(eventName, preventDefaults, false);
        });
        ['dragenter', 'dragover'].forEach(eventName => {
            current.addEventListener(eventName, highlight, false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            current.addEventListener(eventName, unhighlight, false);
        });
        current.addEventListener('drop', handleDrop, false);

        return () => {
            current.removeEventListener('drop', handleDrop);
            current.removeEventListener('drop', unhighlight);
            current.removeEventListener('dragleave', unhighlight);
            current.removeEventListener('dragenter', highlight);
            current.removeEventListener('dragover', highlight);
            current.removeEventListener('dragenter', preventDefaults);
            current.removeEventListener('dragover', preventDefaults);
            current.removeEventListener('dragleave', preventDefaults);
            current.removeEventListener('drop', preventDefaults);
        };
        //eslint-disable-next-line
    }, [dropArea]);

    const iconName = (file: any) => {
        if (file && file.mimeType) {
            return (typesMatches.find(icon => icon.mimeTypes.includes(file.mimeType)) || {}).type || '';
        }
        return 'file';
    };
    const getFileName = (file: any) => {
        if (file) {
            let arrayedURL = file.url.split('/');
            let name = arrayedURL[arrayedURL.length - 1];
            let size = file.fileSize + ' байт';

            if (file.fileSize > 1024) {
                size = file.fileSize / 102400 < 1 ? `${Math.floor(file.fileSize / 1024)} Кб` : `${Math.floor(file.fileSize / 1024000)} Мб`;
            }
            return `${name} (${size})`;
        }
    };

    return (
        <div className={`uploadFile multiple ? isMultiple : '' disabled ? isDisabled : '' ${className}`}>
            {label && <span className="uploadFile__label">{label}</span>}
            <div className="uploadFile__dropArea" ref={dropArea}>
                {isFileLoaded ? (
                    <div className="uploadFile__previewList">
                        {files.map((file, index) => {
                            return (
                                <div className="uploadFile__preview" key={`${file.relativePath}${file.fileSize}${index}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 34" className="uploadFile__previewIcon">
                                        <path fill="none" d="M-1-1h802v602H-1z" />
                                        <path d="M0 2C0 .9.9 0 2 0h22a2 2 0 012 2v30a2 2 0 01-2 2H2a2 2 0 01-2-2V2z" />
                                        <path fill="#fff" d="M5 16h16v1H5v-1zM5 20h16v1H5v-1zM5 24h11v1H5v-1z" />
                                        <text
                                            stroke="#000"
                                            transform="matrix(.33664 0 0 .33664 3.8 8.7)"
                                            fontFamily="Helvetica, Arial, sans-serif"
                                            fontSize="24"
                                            y="6"
                                            x="27"
                                            strokeOpacity="null"
                                            strokeWidth="0"
                                            fill="#fff"
                                            textAnchor="middle">
                                            {iconName(file)}
                                        </text>
                                    </svg>

                                    <p className="uploadFile__name">{getFileName(file)}</p>
                                    <button type="button" className="uploadFile__deleteBtn" onClick={() => deleteFile(index)}>
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="uploadFile__empty">
                        <svg className="upload__Fileicon" width="16" height="16" viewBox="0 0 61 61" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M38.85 30.02c.92 0 1.65.58 1.79 1.42.2 1.05-.5 2-1.57 2.12l-.48.01H27.22c-.24 0-.48 0-.71-.06-.9-.24-1.45-1-1.35-1.9.08-.88.8-1.56 1.71-1.58.86-.02 1.73-.02 2.59-.02H38.85zM27.28 40.51h7.52c1.39 0 2.8.01 4.19-.01a1.7 1.7 0 001.68-1.67A1.74 1.74 0 0039.15 37c-.2-.03-.4-.03-.59-.03h-11.3c-.23 0-.47.02-.7.07-.78.15-1.36.84-1.39 1.63-.03.83.5 1.57 1.29 1.78.27.08.55.06.82.06z" />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M32.67 0h2.14c.14.1.3.1.45.12h.06a10.93 10.93 0 019.33 8.8l.12.55.63.19c4.93 1.68 8.04 5.01 9.1 10.14.12.54.3.78.83.97a8.39 8.39 0 015.65 7.53 8.5 8.5 0 01-8.22 8.74h-2.2l-1.68.01h-.17c-.2-.01-.4-.02-.64.06v.83c0 .83.01 1.66-.01 2.5-.02.4.1.7.38 1.01a650.32 650.32 0 014.66 5.49c.3.36.62.72.91 1.1.43.57.5 1.2.16 1.86a1.68 1.68 0 01-1.71.97c-.15-.01-.3-.02-.45.08-.08.17-.08.36-.07.54v7.54c0 .89-.34 1.53-1.2 1.86-.05.01-.08.08-.13.11h-4.28c-.12-.11-.26-.1-.39-.13a6.46 6.46 0 01-5.1-4.59c-.2-.06-.4-.05-.6-.05H23.2c-.8 0-1.59-.09-2.32-.42a4.98 4.98 0 01-3.14-4.83V42.2v-4.38-.18c.02-.18.03-.35-.06-.52-.18-.09-.37-.08-.55-.07H8.4a8.56 8.56 0 01-8.23-6.93c-.02-.2-.04-.4-.17-.57v-1.8c.08-.1.1-.2.11-.33a8.3 8.3 0 015.6-6.67c.98-.37 2-.51 3.04-.51h1.78a367.41 367.41 0 01.94 0c.47-2.9 1.73-5.39 3.82-7.4 2.1-2.03 4.64-3.21 7.48-3.67a1.95 1.95 0 01.04-.1c.03-.06.04-.1.04-.14.97-4.56 3.78-7.37 8.23-8.62.23-.06.45-.1.68-.12.31-.04.62-.08.9-.2zm16.9 33.49h.01c1.08 0 2.14.02 3.2-.03a4.91 4.91 0 004.66-4.83 5 5 0 00-4.36-4.8c-1.37-.21-1.83-.7-1.91-2.06a9.3 9.3 0 00-.37-2.28c-1.25-3.82-3.9-6-7.8-6.75-1.17-.23-1.72-.81-1.74-2.02a7.24 7.24 0 00-.2-1.65 7.52 7.52 0 00-8.04-5.5 7.34 7.34 0 00-6.75 7.09c-.03 1-.7 1.95-1.94 1.95-.64 0-1.27.11-1.89.25a9.58 9.58 0 00-7.53 9.04c-.03 1.18-.74 1.87-1.92 1.89H9c-.54 0-1.08 0-1.58.14a4.84 4.84 0 00-3.64 3.43A4.5 4.5 0 005.02 32a5.18 5.18 0 003.83 1.5l4.16-.01 4.17-.01h.1c.14 0 .3.02.48-.13v-7.73c0-.69.07-1.35.31-1.99a5.24 5.24 0 014.96-3.37c1.04-.02 2.08-.01 3.13 0h16.39c1 0 1.98.16 2.85.67a5.1 5.1 0 012.69 4.72v7.28c0 .17 0 .35.1.55h1.37zm-8.95 17.38h-.08c-.16-.02-.28-.03-.4-.02-.8.02-1.4-.3-1.74-1.03-.33-.75-.16-1.41.37-2.03l2.68-3.16.01-.02 2.7-3.18c.28-.31.4-.65.4-1.06l-.01-11.6v-1.08-2.14c-.02-1.05-.67-1.68-1.73-1.73H23.4c-.2 0-.4 0-.59.02-.9.1-1.48.71-1.52 1.6V48.9l.01 2.2c.02.69.38 1.15.99 1.44.3.12.62.14.93.14h16.92c.15.02.31.03.46-.1.05-.57.06-1.1.01-1.71zm5.7-6.5l-.57.68-2.2 2.6c.6.76.65.91.65 1.84v5.05a2.84 2.84 0 002.19 2.76c.49.13.98.11 1.49.1l.56-.02v-.65a688.33 688.33 0 010-2.34v-4.68c0-.76.01-1.51.68-2.05l-2.44-2.86-.35-.43z"
                            />
                        </svg>
                        <p className="uploadFile__paragraph">{children ? children : 'Выберите файл или перетащите нужный в выделенную область'}</p>
                    </div>
                )}

                {(!isFileLoaded || multiple) && (
                    <form className="uploadFile__form" onSubmit={e => e.preventDefault()}>
                        <input
                            type="file"
                            ref={fileInput}
                            className="uploadFile__input"
                            accept={`.${allowedTypes.join(', .')}`}
                            multiple={multiple}
                            onChange={(e: any) => uploadFiles(e.target.files)}
                            disabled={disabled}
                        />
                        <Btn
                            className={`uploadFile__button isUploading ? isUploading : ''`}
                            onClick={() => {
                                //@ts-ignore
                                fileInput.current.click();
                            }}>
                            {'Выбрать'}
                        </Btn>
                    </form>
                )}
            </div>
        </div>
    );
};
export default memo(UploadFile);
