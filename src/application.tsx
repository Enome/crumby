import cx from "classnames";
import calculate from "./calculate";
import InputText from "./components/text";
import InputNumber from "./components/number";
import InputRatio from "./components/ratio";
import Formula from "./components/formula";
import Button from "./components/button";
import Share from "./components/share";

import { LiaTimesCircleSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { State, actions } from "./state";

export default function Application() {
  const [loading, setLoading] = useState(true);

  const state = useSelector((state: State) => state);
  const output = calculate(state);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const data_encoded = window.location.pathname.substring(1);
      const data_decoded_base64 = atob(data_encoded);
      const data_decoded_json = JSON.parse(data_decoded_base64);
      dispatch(actions.load(data_decoded_json));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  function updateNumber(name: keyof Omit<State, "percentages">) {
    return function (value: number) {
      dispatch(actions.updateValue(name, value));
    };
  }

  return (
    <div className="p-8 rs:mx-auto rs:w-[500px] rs:p-10 rs:m-8 rs:rounded-xl rs:border">
      <div>
        <InputText
          className={cx("input", "t1")}
          defaultValue={state.name}
          onChange={(e) => {
            dispatch(actions.updateValue("name", e.target.value));
          }}
        />
      </div>

      <h2 className="t2">Dough balls:</h2>
      <div className="section">
        <InputNumber
          defaultValue={state.doughballCount}
          onChangeNumber={updateNumber("doughballCount")}
          pattern={/^\d+$/}
          fixed={0}
        />
        {" x "}
        <InputNumber
          defaultValue={state.doughballWeight}
          onChangeNumber={updateNumber("doughballWeight")}
        />
        {"g = "}
        <Formula bold value={output.targetWeight} suffix="g" />
      </div>

      <h2 className="t2">
        Base{" "}
        <Button
          className="my-2"
          onClick={() => {
            dispatch(actions.addPercentage("Ingredient", 0));
          }}
        >
          Add
        </Button>
      </h2>
      <table className="section">
        <tbody>
          {output.percentagesAndWeights.map((b) => (
            <tr key={b.id}>
              <th>
                {b.base ? (
                  b.name
                ) : (
                  <>
                    <LiaTimesCircleSolid
                      className="text-gray-500 hover:text-red-500 absolute ml-[-18px] mt-[4.5px] cursor-pointer"
                      onClick={() => {
                        dispatch(actions.removePercentage(b.id));
                      }}
                    />
                    <InputText
                      defaultValue={b.name}
                      onChange={(e) => {
                        dispatch(
                          actions.updatePercentage(
                            b.id,
                            e.target.value,
                            undefined,
                          ),
                        );
                      }}
                    />
                  </>
                )}
              </th>
              <td>
                {b.name === "Flour" ? (
                  "100"
                ) : (
                  <InputNumber
                    defaultValue={b.percentage}
                    onChangeNumber={(value) => {
                      dispatch(
                        actions.updatePercentage(b.id, undefined, value),
                      );
                    }}
                  />
                )}
                %
              </td>
              <td>
                <Formula value={b.weight} suffix="g" />
              </td>
            </tr>
          ))}
          <tr>
            <th className="font-bold">Total</th>
            <td></td>
            <td>
              <Formula bold value={output.targetWeight} suffix="g" />
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="t2">
        Flours{" "}
        <Button
          className="my-2"
          onClick={() => {
            dispatch(actions.addFlour("White", 0));
          }}
        >
          Add
        </Button>
      </h2>
      <table className="section">
        <tbody>
          {output.flours.map((b) => (
            <tr key={b.id}>
              <th>
                <LiaTimesCircleSolid
                  className="text-gray-500 hover:text-red-500 absolute ml-[-18px] mt-[4.5px] cursor-pointer"
                  onClick={() => {
                    dispatch(actions.removeFlour(b.id));
                  }}
                />
                <InputText
                  defaultValue={b.name}
                  onChange={(e) => {
                    dispatch(
                      actions.updateFlour(b.id, e.target.value, undefined),
                    );
                  }}
                />
              </th>
              <td>
                <InputNumber
                  defaultValue={b.percentage}
                  onChangeNumber={(value) => {
                    dispatch(actions.updateFlour(b.id, undefined, value));
                  }}
                />
                %
              </td>
              <td>
                <Formula highlight value={b.weight} suffix="g" />
              </td>
            </tr>
          ))}
          <tr>
            <th className="font-bold">Total</th>
            <td></td>
            <td>
              <Formula
                bold
                error={
                  output.flourWeight.toFixed(2) !==
                  output.floursWeight.toFixed(2)
                }
                value={output.floursWeight}
                suffix="g"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="section">
        <h2 className="t2">
          Sourdough{" "}
          <input
            type="checkbox"
            checked={state.sourdough}
            onChange={() => {
              dispatch(actions.updateValue("sourdough", !state.sourdough));
            }}
          />
        </h2>
        {state.sourdough && (
          <table>
            <tbody>
              <tr>
                <th>Target</th>
                <td>
                  <InputNumber
                    defaultValue={state.sourdoughTarget}
                    onChangeNumber={(value) =>
                      dispatch(actions.updateValue("sourdoughTarget", value))
                    }
                  />
                  %
                </td>
              </tr>
              <tr>
                <th>Ratio (Starter:Flour:Water)</th>
                <td>
                  <InputRatio
                    defaultValue={state.sourdoughRatio}
                    length={3}
                    onChange={(e) => {
                      dispatch(
                        actions.updateValue("sourdoughRatio", e.target.value),
                      );
                    }}
                  />
                </td>
              </tr>
              <tr>
                <th>Starter</th>
                <td>
                  <Formula
                    highlight
                    value={output.sourdough.starter}
                    suffix="g"
                  />
                </td>
              </tr>
              <tr>
                <th>Flour</th>
                <td>
                  <Formula
                    highlight
                    value={output.sourdough.flour}
                    suffix="g"
                  />
                </td>
              </tr>
              <tr>
                <th>Water</th>
                <td>
                  <Formula
                    highlight
                    value={output.sourdough.water}
                    suffix="g"
                  />
                </td>
              </tr>
              <tr>
                <th className="font-bold">Total</th>
                <td>
                  <Formula bold value={output.sourdough.total} suffix="g" />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div className="section">
        <h2 className="t2">
          Preferment{" "}
          <input
            type="checkbox"
            checked={state.preferment}
            onChange={() => {
              dispatch(actions.updateValue("preferment", !state.preferment));
            }}
          />
        </h2>
        {state.preferment && (
          <table>
            <tbody>
              <tr>
                <th>Type</th>
                <td>
                  <select
                    className="input bg-white p-1"
                    value={state.prefermentType}
                    onChange={(e) =>
                      dispatch(
                        actions.updateValue("prefermentType", e.target.value),
                      )
                    }
                  >
                    <option value="Poolish">Poolish</option>
                    <option value="Biga">Biga</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Target</th>
                <td>
                  <InputNumber
                    defaultValue={state.prefermentTarget}
                    onChangeNumber={(value) =>
                      dispatch(actions.updateValue("prefermentTarget", value))
                    }
                  />
                  %
                </td>
              </tr>
              <tr>
                <th>Ratio (Flour:Water)</th>
                <td>
                  <InputRatio
                    defaultValue={state.prefermentRatio}
                    length={2}
                    onChange={(e) =>
                      dispatch(
                        actions.updateValue("prefermentRatio", e.target.value),
                      )
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Flour</th>
                <td>
                  <Formula
                    highlight
                    value={output.preferment.flour}
                    suffix="g"
                  />
                </td>
              </tr>
              <tr>
                <th>Water</th>
                <td>
                  <Formula
                    highlight
                    value={output.preferment.water}
                    suffix="g"
                  />
                </td>
              </tr>
              <tr>
                <th>Yeast</th>
                <td>
                  <Formula
                    highlight
                    value={output.preferment.yeast}
                    suffix="g"
                  />
                </td>
              </tr>
              <tr>
                <th className="font-bold">Total</th>
                <td>
                  <Formula bold value={output.preferment.total} suffix="g" />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <h2 className="t2">Dough</h2>
      <table className="section">
        <tbody>
          {output.dough.map((b) => (
            <tr key={b.id}>
              <th>{b.name}</th>
              <td>
                <Formula
                  highlight={!["Flour"].includes(b.name)}
                  value={b.weight}
                  suffix="g"
                />
              </td>
            </tr>
          ))}
          {state.sourdough && (
            <tr>
              <th>Sourdough</th>
              <td>
                <Formula value={output.sourdough.total} suffix="g" />
              </td>
            </tr>
          )}
          {state.preferment && (
            <tr>
              <th>Preferment</th>
              <td>
                <Formula value={output.preferment.total} suffix="g" />
              </td>
            </tr>
          )}
          <tr>
            <th className="font-bold">Total</th>
            <td>
              <Formula bold value={output.targetWeight} suffix="g" />
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="t2">Share</h2>
      <Share state={state} />
    </div>
  );
}
