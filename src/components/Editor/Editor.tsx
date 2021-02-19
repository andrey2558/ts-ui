import React, { FC, memo, useRef } from 'react';
//@ts-ignore
import { Editor } from '@tinymce/tinymce-react';
import { useDebounce } from '../../hooks/useDebounce';

export type EditorProps = {
  authorization?: string;
  url?: string;
  value: string;
  onChange: (string: string) => void;
  error?: string;
  onClearError?: () => void;
  className?: string;
};
const EditorComponent: FC<EditorProps> = props => {
  const {
    authorization = '',
    url = '',
    value,
    onChange,
    className = '',
  } = props;
  const headers = {
    accept: 'application/json, text/plain, */*',
    authorization,
  };
  const { debounceChange, stringValue } = useDebounce(value, onChange, 150);
  const uploadImage = async (
    file: string | Blob,
    fileName: string | undefined,
    dataProp: any,
    width: string | Blob,
    height: string | Blob,
    success: any,
    fail: any
  ): Promise<void> => {
    const fd = new FormData();
    fd.append('image', file, fileName);
    fd.append('temp', 'false');
    fd.append('path', 'content');
    const response = await fetch(url, {
      headers,
      method: 'POST',
      body: fd,
    });

    const data = await response.json();
    //@ts-ignore
    if (typeof success === 'function') {
      //@ts-ignore
      success(data?.imagePath);
    }
    setTimeout(() => {
      //@ts-ignore
      editor.current.editor.setContent(editor.current.editor.getContent());
    }, 1);
  };
  const initConfig = {
    height: 500,
    menubar: true,
    plugins: [
      'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars code fullscreen',
      'insertdatetime media nonbreaking save table contextmenu directionality',
      'emoticons template paste textcolor colorpicker textpattern codesample toc',
    ],
    toolbar1:
      'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    toolbar2:
      'print preview media | forecolor backcolor emoticons | codesample',
    images_upload_credentials: true,
    image_title: true,
    // enable automatic uploads of images represented by blob or data URIs
    //   automatic_uploads: true,
    // URL of our upload handler (for more details check: https://www.tinymce.com/docs/configure/file-image-upload/#images_upload_url)
    images_upload_url:
      'https://api.nuzhnaeda.ru/api/admin/common/uploadTempImage',
    language: 'ru',
    // here we add custom filepicker only to Image dialog
    file_picker_types: 'image',
    // and here's our custom image picker
    //@ts-ignore
    file_picker_callback: function(cb, value, meta) {
      let input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      // Note: In modern browsers input[type="file"] is functional without
      // even adding it to the DOM, but that might not be the case in some older
      // or quirky browsers like IE, so you might want to add it to the DOM
      // just in case, and visually hide it. And do not forget do remove it
      // once you do not need it anymore.

      input.onchange = (e: any) => {
        const file = e.target.files?.[0];

        if (file) {
          const getBase64 = (file: any) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                //@ts-ignore
                let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
                if (encoded.length % 4 > 0) {
                  encoded += '='.repeat(4 - (encoded.length % 4));
                }
                resolve(encoded);
              };
              reader.onerror = error => reject(error);
            });
          };
          getBase64(file).then(fileBase64 => {
            const id = 'blobid' + new Date().getTime();
            // @ts-ignore
            const blobCache = editor.current.editor.editorUpload.blobCache;
            //@ts-ignore
            const blobInfo = blobCache.create(id, file, fileBase64);
            blobCache.add(blobInfo);
            cb(blobInfo.blobUri(), { title: file.name });
          });
        }
      };

      input.click();
    },
    //@ts-ignore
    images_upload_handler: async (blobInfo, success, failure) => {
      await uploadImage(
        blobInfo.blob(),
        blobInfo.filename(),
        'uploadedImageDataProp',
        '120',
        '120',
        success,
        failure
      );
    },
  };
  const editor = useRef(null);

  return (
    <div className={className}>
      <Editor
        ref={editor}
        initialValue={stringValue}
        init={initConfig}
        onEditorChange={debounceChange}
      />
    </div>
  );
};

export default memo(EditorComponent);
