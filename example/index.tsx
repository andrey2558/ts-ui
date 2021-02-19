import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useState } from 'react';
import { Meta } from '../src/components/Pagination';
import { FileType } from '../src/components/UploadFile';
import {
  Btn,
  Editor,
  Tabs,
  UploadImage,
  Breadcrumbs,
  UploadFile,
  Select,
  ActionBlock,
  Checkbox,
  DefaultHeading,
  CustomTextarea,
  CustomInput,
  Pagination,
} from '../dist';
const App = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [maskedVal, setMaskedValue] = useState<string>('+79995204849');
  const [counterVal, setCounterVal] = useState<string>('1');
  const [pagination, setPagination] = useState<Meta>({
    offset: 0,
    limit: 12,
    total: 234,
  });
  const [select, setSelect] = useState<string | number>('1');
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [singleSearchSelect, setSingleSearchSelect] = useState<string>('');
  const [multiSearchSelect, setMultiSearchSelect] = useState<
    Array<string | number>
  >([]);
  const selectItems = [
    { id: '1', value: 'first', foo: 'foo' },
    { id: '2', value: 'second', bar: 'bar' },
    { id: 3, value: '123', bar: 'bar' },
  ];
  const [files, setFiles] = useState<FileType[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [textarea, setTextarea] = useState<string>('');
  const [editor, setEditor] = useState<string>('');
  const tabItems = [
    {
      id: 1,
      name: 'Pagination',
      children: <Pagination meta={pagination} onChange={setPagination} />,
    },
    {
      id: 2,
      name: 'Input',
      children: (
        <>
          <CustomInput
            value={inputValue}
            type={'text'}
            onChange={setInputValue}
            label={'label'}
          />
          <CustomInput
            value={maskedVal}
            type={'tel'}
            readonly={true}
            onChange={setMaskedValue}
            label={'label'}
          />
          <CustomInput
            value={counterVal}
            type={'counter'}
            onChange={setCounterVal}
            min={1}
            max={12}
            label={'label'}
          />
          <CustomTextarea
            label={'label'}
            value={textarea}
            onChange={setTextarea}
          />
        </>
      ),
    },
    {
      id: 3,
      name: 'DefaultHeading',
      children: (
        <DefaultHeading title={'title'}>
          <>
            <Btn type={'danger'} onClick={() => setInputValue('123123')}>
              Кнопка
            </Btn>

            <Checkbox
              value={checkboxValue}
              onChange={setCheckboxValue}
              type={'roll'}
            >
              Checkbox
            </Checkbox>
          </>
        </DefaultHeading>
      ),
    },
    {
      id: 6,
      name: 'ActionBlock',
      children: <ActionBlock arrayParams={[]} />,
    },
    {
      id: 7,
      name: 'Select',
      children: (
        <>
          <Select
            value={select}
            items={selectItems}
            onChange={(e: any) => setSelect(e?.id || '')}
            label={'single'}
          />
          <Select
            value={multiSelect}
            items={selectItems}
            onChange={(e: any) =>
              setMultiSelect(Array.from(e, (i: any) => i.id))
            }
            label={'multi'}
          />
          <Select
            value={singleSearchSelect}
            items={selectItems}
            onChange={(e: any) => setSingleSearchSelect(e?.id || '')}
            search={{ isLocal: true }}
          />
          <Select
            value={multiSearchSelect}
            search={{
              isLocal: false,
              searchParams: {
                params: {
                  headers: {
                    'content-type': 'application/json; charset=utf-8',
                  },
                },
                field: 'items',
                idField: 'id',
                nameField: 'name',
                searchField: 'q',
                url:
                  'https://api.presentation.food.true-false.ru/api/public/shop/products',
              },
            }}
            label={'multiSearch'}
            items={[]}
            onChange={(e: any) => {
              const ids = Array.from(e, (i: any) => i.id);
              setMultiSearchSelect(ids);
            }}
          />
        </>
      ),
    },
    {
      id: 11,
      name: 'UploadFile',
      children: (
        <UploadFile
          files={files}
          multiple={true}
          headers={{
            authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5udXpobmFlZGEucnUvYXBpL2FkbWluL2xvZ2luIiwiaWF0IjoxNTk0Nzk1Mzg3LCJleHAiOjE2MzEwODMzODcsIm5iZiI6MTU5NDc5NTM4NywianRpIjoiNVBZMDdNaGJyMEdZaHVGZCIsInN1YiI6MTUsInBydiI6ImY5NjZlZjE1OTk4YWNhZjBiMmE5OWEwNzY2ODgyOTg0MzdhYTRmNmEifQ.eBYS8opSwt3bkZMUlNHlBd90hQDj1O-8iTxt-eAA0fE',
          }}
          url={'https://api.nuzhnaeda.ru/api/admin/common/uploadTempDoc'}
          onChange={setFiles}
        />
      ),
    },
    {
      id: 12,
      name: 'Breadcrumbs',
      children: (
        <Breadcrumbs
          items={[{ name: 'test', goTo: () => {} }]}
          svg={<div>тут свг</div>}
        />
      ),
    },
    {
      id: 13,
      name: 'Upload Image',
      children: (
        <UploadImage
          images={images}
          headers={{
            authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5udXpobmFlZGEucnUvYXBpL2FkbWluL2xvZ2luIiwiaWF0IjoxNTk0Nzk1Mzg3LCJleHAiOjE2MzEwODMzODcsIm5iZiI6MTU5NDc5NTM4NywianRpIjoiNVBZMDdNaGJyMEdZaHVGZCIsInN1YiI6MTUsInBydiI6ImY5NjZlZjE1OTk4YWNhZjBiMmE5OWEwNzY2ODgyOTg0MzdhYTRmNmEifQ.eBYS8opSwt3bkZMUlNHlBd90hQDj1O-8iTxt-eAA0fE',
          }}
          url={'https://api.nuzhnaeda.ru/api/admin/common/uploadTempImage'}
          onChange={setImages}
          multiple={true}
        />
      ),
    },
    {
      id: 14,
      name: 'Text editor',
      children: (
        <Editor
          value={editor}
          onChange={setEditor}
          url={'https://api.nuzhnaeda.ru/api/admin/common/uploadTempImage'}
          authorization={
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5udXpobmFlZGEucnUvYXBpL2FkbWluL2xvZ2luIiwiaWF0IjoxNTk0Nzk1Mzg3LCJleHAiOjE2MzEwODMzODcsIm5iZiI6MTU5NDc5NTM4NywianRpIjoiNVBZMDdNaGJyMEdZaHVGZCIsInN1YiI6MTUsInBydiI6ImY5NjZlZjE1OTk4YWNhZjBiMmE5OWEwNzY2ODgyOTg0MzdhYTRmNmEifQ.eBYS8opSwt3bkZMUlNHlBd90hQDj1O-8iTxt-eAA0fE'
          }
        />
      ),
    },
  ];
  const [test, setTest] = useState('1');
  return (
    <div>
      <Tabs items={tabItems} />

      <CustomInput
        value={test}
        type={'counter'}
        onChange={e => {
          setTest(e);
        }}
        min={1}
        max={12}
        label={'label test'}
      />

      <Btn onClick={() => setTest(parseInt(test) + 12 + '')}>asd</Btn>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
