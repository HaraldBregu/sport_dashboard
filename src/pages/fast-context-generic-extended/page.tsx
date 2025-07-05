import createFastContext from "./createFastContext";

function PropDrivenContentContainer() {
  console.log(`Prop Driven Content Rendering`)
  return (
    <div className="container">
      <h3>'Prop Driven' Content Container (NO RE-RENDERS)</h3>
      <PropDrivenFormContainer />
      <PropDrivenDisplayContainer />
    </div>
  );
};

function SelfDrivenContentContainer() {
  console.log(`Self Driven Content Rendering`)
  return (
    <div className="container">
      <h3>'Self Driven' Content Container (NO RE-RENDERS)</h3>
      <SelfDrivenFormContainer />
      <SelfDrivenDisplayContainer />
    </div>
  );
};

type PropDrivenDisplayProps = {
  fieldName?: string;
  label?: string;
  value?: string;
};
export function PropDrivenDisplay({ label, value }: Readonly<PropDrivenDisplayProps>) {
  console.log(`Prop Driven ${label} display rendering`)
  return (
    <div className="value">
      {label ? <label>{label} : </label> : null}
      <input value={value} readOnly style={{ backgroundColor: "#eee", cursor: 'auto', border: 0 }} />
    </div>
  );
};

function SelfDrivenDisplay({ fieldName = "", label }: Readonly<PropDrivenDisplayProps>) {
  console.log(`Self Driven ${label} display rendering`)
  const value = useAppFastContextFields([fieldName]);
  return (
    <div className="value">
      {label ? <label>{label} : </label> : null}
      <input value={value[fieldName].get as string} readOnly style={{ backgroundColor: "#eee", cursor: 'auto', border: 0 }} />
    </div>
  );
};

function PropDrivenDisplayContainer() {
  console.log(`Prop Driven Display Rendering`)
  const fields = useAppFastContextFields(['first', 'last']);
  return (
    <div className="container">
      <h4>'Prop Driven' Display (Container AND children re-render on field changes)</h4>
      <PropDrivenDisplay label="First Name" value={fields.first.get as string} />
      <PropDrivenDisplay label="Last Name" value={fields.last.get as string} />
    </div>
  );
};

function SelfDrivenDisplayContainer() {
  console.log(`Self Driven Display Rendering`)
  return (
    <div className="container">
      <h4>'Self Driven' Display (NO RE-RENDERS - only children re-render on field changes)</h4>
      <SelfDrivenDisplay fieldName="first" label="First Name" />
      <SelfDrivenDisplay fieldName="last" label="Last Name" />
    </div>
  );
};

function PropDrivenFormContainer() {
  console.log(`Prop Driven Form Rendering`)
  const fields = useAppFastContextFields(['first', 'last']);
  console.log(`fields:`, fields)
  return (
    <div className="container">
      <h4>'Prop Driven' Input Form (Form AND children re-render on field changes)</h4>
      <FormDrivenTextInput value={fields.first.get as string} label='First Name' onChange={fields.first.set} />
      <FormDrivenTextInput value={fields.last.get as string} label='Last Name' onChange={fields.last.set} />
    </div>
  );
};

function SelfDrivenFormContainer() {
  console.log(`Self Driven Form Rendering`)
  return (
    <div className="container">
      <h4>'Self Driven' Input Form (NO RE-RENDERS - only children re-render on field changes)</h4>
      <SelfDrivenTextInput fieldName="first" label='First Name' />
      <SelfDrivenTextInput fieldName="last" label='Last Name' />
    </div>
  );
};

type Props = {
  fieldName?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
};
function FormDrivenTextInput({ 
  label = '', 
  value, 
  onChange,
 }: Readonly<Props>) {
  console.log(`Prop Driven ${label} input rendering`)
  return (
    <div className="field">
      {label ? <label>{label} : </label> : null}
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};


function SelfDrivenTextInput({ fieldName = "", label }: Readonly<Props>) {
  console.log(`Self Driven ${label} input rendering`)
  const field = useAppFastContextFields([fieldName]);
  return (
    <div className="field">
      {label ? <label>{label} : </label> : null}
      <input
        value={field[fieldName].get as string}
        onChange={(e) => field[fieldName].set(e.target.value)}
      />
    </div>
  );
};





const {
  FastContextProvider: AppFastContextProvider,
  useFastContextFields: useAppFastContextFields
} = createFastContext({
  first: "" as string,
  last: "" as string,
});

function FastContextGenericExtendedPage() {
  console.log(`App Rendering`)
  return (
    <AppFastContextProvider>
      <div className="container">
        <img src="../public/DevToolsImage.png" style={{ float: 'right', width: '350px' }} alt="Dev Tools" />
        <h1>App (NO RE-RENDERS)</h1>
        <p>The App's Fast Context is created and exported here, but could be created in any file.</p>
        <p>Switch on the re-render highlight function (see image) in dev tools to see when re-renders happen.</p>
        <MainPage />
      </div>
    </AppFastContextProvider>
  );
}

export default FastContextGenericExtendedPage;



function MainPage() {
  console.log(`Page Rendering`)
  return (
    <div className="container">
      <h2>Page (NO RE-RENDERS)</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '1em' }}>
        <PropDrivenContentContainer />
        <SelfDrivenContentContainer />
      </div>
    </div>
  );
}
