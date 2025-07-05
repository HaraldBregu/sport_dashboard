import createFastContext from "./createFastContext";

type TestStore = {
  first: string;
  last: string;
  showAlert: boolean;
};

const initialState: TestStore = {
  first: "",
  last: "",
  showAlert: false,
};

const { Provider, useStore } = createFastContext(initialState);

const TextInput = ({ value }: { value: "first" | "last" }) => {
  const [fieldValue, setStore] = useStore((store) => store[value]);
  return (
    <div className="field">
      {value}:{" "}
      <input
        value={fieldValue}
        onChange={(e) => setStore({ [value]: e.target.value })}
      />
    </div>
  );
};

const Display = ({ value }: { value: "first" | "last" }) => {
  const [fieldValue] = useStore((store) => store[value]);
  return (
    <div className="value">
      {value}: {fieldValue}
    </div>
  );
};

const FormContainer = () => {
  return (
    <div className="container">
      <h5>FormContainer</h5>
      <TextInput value="first" />
      <TextInput value="last" />
    </div>
  );
};

const DisplayContainer = () => {
  return (
    <div className="container">
      <h5>DisplayContainer</h5>
      <Display value="first" />
      <Display value="last" />
    </div>
  );
};

const ViewAlert = () => {
  const [showAlert] = useStore((store) => store.showAlert);
  return (
    <div>{showAlert ? "Alert" : "No Alert"}</div>
  );
};

const ButtonShowAlert = () => {
  const [showAlert, setStore] = useStore((store) => store.showAlert);
  return (
    <button onClick={() => setStore({ showAlert: !showAlert })}>Show Alert</button>
  );
};

const ContentContainer = () => {
  return (
    <div className="container">
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />
      <ViewAlert />
      <ButtonShowAlert />
    </div>
  );
};

function FastContextGenericPage() {
  return (
    <Provider>
      <div className="container">
        <h5>App</h5>
        <ContentContainer />
      </div>
    </Provider>
  );
}

export default FastContextGenericPage;