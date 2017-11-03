import {toEqualInAnyOrderMatcher} from "./test/matchers/toEqualInAnyOrder";
import * as Enzyme from "enzyme";
import Adapter from 'enzyme-adapter-react-16';

expect.extend(toEqualInAnyOrderMatcher);

Enzyme.configure({ adapter: new Adapter() });