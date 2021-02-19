import React, { FC, memo, useMemo, useRef } from 'react';

export type Image = {
  image?: string;
  imagePath?: string;
  thumb: string;
  thumb2x: string;
};
export type UploadImageProps = {
  images: Image[];
  url: string;
  headers: { authorization: string };
  label?: string;
  allowedTypes?: string[];
  disabled?: boolean;
  saveParams?: any;
  multiple?: boolean;
  onChange: (data: Image[]) => void;
  className?: string;
};
const UploadImage: FC<UploadImageProps> = props => {
  const {
    images,
    url,
    label = '',
    allowedTypes = ['jpg', 'webp', 'png', 'jpeg', 'svg'],
    disabled = false,
    saveParams = {},
    multiple = false,
    onChange,
    className = '',
  } = props;
  const headers = {
    accept: 'application/json, text/plain, */*',
    ...props.headers,
  };

  const prepareFormData = (formData: FormData): FormData => {
    const keysSaveParams = Object.keys(saveParams);
    if (keysSaveParams.length > 0) {
      keysSaveParams.forEach(key => {
        formData.append(key, saveParams[key]);
      });
    }
    return formData;
  };

  const inputRef = useRef(null);
  const clickOnInput = (): void => {
    if (inputRef.current) {
      //@ts-ignore
      inputRef.current.click();
    }
  };

  const uploadImage = async (e: any): Promise<void> => {
    const files = e.currentTarget.files;
    const form = e.currentTarget.closest('form');
    const promiseList: Array<Promise<Image | undefined>> = [];

    Array.prototype.forEach.call(files, (item, index) => {
      const arrayedFileName = item.name.split('.');
      const type = arrayedFileName[arrayedFileName.length - 1].toLowerCase();
      if (allowedTypes.includes(type) && multiple ? index >= 0 : index === 0) {
        let formData = new FormData();
        formData.append('image', item);
        formData = prepareFormData(formData);

        const sendMethod = async () => {
          const response = await fetch(url, {
            headers,
            method: 'POST',
            body: formData,
          });
          const responseJson = (await response.json()) as Image;

          if (response.status === 200) {
            return responseJson;
          } else if (400 <= response.status || response.status < 500) {
            //
          }
        };
        promiseList.push(sendMethod());
      }
    });

    await Promise.all(promiseList)
      .then(data => {
        const value = [
          ...(multiple ? images : []),
          ...data.filter(item => item),
        ] as Image[];
        onChange(value);
      })
      .catch(error => console.log(error));

    form.reset();
  };

  const deleteImage = (index: number): void => {
    const value = images.filter((el, i) => i !== index);
    onChange(value);
  };

  const isAddButtonNeed = useMemo<boolean>(() => {
    let value = true;
    if (disabled) {
      return false;
    }

    if (!multiple) {
      return images.length === 0;
    }
    return value;
  }, [disabled, images, multiple]);

  return (
    <div
      className={`uploadImage ${multiple ? 'isMultiple' : ''}
       ${className}`}
    >
      <div className="uploadImage__inner">
        {label && <p className="uploadImage__text">{label}</p>}

        <div className="uploadImage__list">
          {images.length > 0 &&
            images.map((image, index) => {
              return (
                <div
                  className="uploadImage__galleryItem js-imageHandle"
                  key={image.thumb}
                >
                  <img
                    src={image.thumb}
                    alt="uploadImage"
                    className="uploadImage__thumb"
                  />

                  {!disabled && (
                    <button
                      className="uploadImage__deleteImage"
                      onClick={() => deleteImage(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}

          {isAddButtonNeed && (
            <form
              key={`fileInput${images.length}`}
              onSubmit={e => e.preventDefault()}
              className="uploadImage__galleryItem add"
            >
              <button className="uploadImage__galleryBtn" onClick={clickOnInput}>
                <span className="uploadImage__galleryBtnImage" />
                <input
                  className="uploadImage__hiddenInput"
                  type="file"
                  ref={inputRef}
                  accept={`.${allowedTypes.join(', .')}`}
                  onInput={async e => await uploadImage(e)}
                  multiple
                />
              </button>
            </form>
          )}
        </div>

        {/*this.error && <div className="uploadImage__errorMessage">{this.error}</div>*/}
      </div>
    </div>
  );
};
export default memo(UploadImage);
