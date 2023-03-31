
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

declare module 'moment/dist/locale/*' {
  import { LocaleSpecification } from 'moment';
  const locale: LocaleSpecification & ReadonlyRecordable;
  export default locale;
}

declare module 'virtual:*' {
  const result: any;
  export default result;
}

declare module 'he' {
  const he: any;
  export default he;
}
