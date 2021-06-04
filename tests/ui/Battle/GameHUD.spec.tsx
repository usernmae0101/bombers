import React from "react";
import configurateStore from "redux-mock-store";
import { render } from "enzyme";
import { Provider } from "react-redux";

import GameHUD from "@bombers/client/src/ui/components/Battle/GameHUD";

describe("component GameHUD should renders correctly", () => {
    const mockStore = configurateStore();
    let wrapper: cheerio.Cheerio;

    const setStore = (store: any) => {
        wrapper = render(<Provider store={store}><GameHUD /></Provider>)
    };

    it("should renders correct values of items", () => {
        const store = mockStore({
            game: {
                HUD: {
                    speed: 3,
                    radius: 1,
                    bombs: 2
                }
            }
        });
        setStore(store);

        expect(wrapper.find("div[data-item=speed]").text()).toContain("3");
        expect(wrapper.find("div[data-item=radius]").text()).toContain("1");
        expect(wrapper.find("div[data-item=bombs]").text()).toContain("2");
    });
});
