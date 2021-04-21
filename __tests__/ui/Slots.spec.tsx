import configurateStore from "redux-mock-store";
import { render } from "enzyme";
import { Provider } from "react-redux";
import React from "react";

import { slots, PlayerColors } from "@bombers/shared/src/idnex";
import Slots from "@bombers/client/src/ui/components/Battle/Slots";

describe("Slots component should renders correctly", () => {
    const mockStore = configurateStore();
    let wrapper: cheerio.Cheerio;

    const setStore = (store: any) => {
        wrapper = render(<Provider store={store}><Slots /></Provider>)
    };

    it("should renders 4 empty slots", () => {
        const store = mockStore({ game: { slots } });
        setStore(store);

        expect(wrapper.find("li")).toHaveLength(4);
    });

    it("should renders 1 slot with the nickname John Doe", () => {
        const store = mockStore({
            game: {
                slots: {
                    [PlayerColors.PURPLE]: {
                            nickname: "John Doe"
                    }
                }
            }
        });
        setStore(store);

        expect(wrapper.text()).toContain("John Doe");
    });
});
