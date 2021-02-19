import * as React from 'react';
import Btn from './components/Btn';
import ActionBlock from './components/ActionBlock';
import Breadcrumbs from './components/Breadcrumbs';
import Checkbox from './components/Checkbox';
import CustomInput from './components/CustomInput';
import CustomTextarea from './components/CustomTextarea';
import DefaultHeading from './components/DefaultHeading';
import Editor from './components/Editor';
import Pagination from './components/Pagination';
import Select from './components/Select';
import {
  getSuccessAlert,
  getErrorAlert,
  getConfirmAlert,
} from './components/sweetAlert';
import Tabs from './components/Tabs';
import UploadFile from './components/UploadFile';
import UploadImage from './components/UploadImage';
import { useDebounce } from './hooks/useDebounce';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import LazyImage from './components/LazyImage/LazyImage';
import './style/app.scss';

export {
  Btn,
  ActionBlock,
  Breadcrumbs,
  Checkbox,
  CustomInput,
  CustomTextarea,
  DefaultHeading,
  Editor,
  Pagination,
  Select,
  getSuccessAlert,
  getErrorAlert,
  getConfirmAlert,
  Tabs,
  UploadFile,
  UploadImage,
  useDebounce,
  useIntersectionObserver,
  LazyImage,
};
export * from './components/Pagination';
export * from './components/UploadFile';
