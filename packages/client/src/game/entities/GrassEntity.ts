import BaseEntity from "../core/BaseEntity";
import { RESOURCE_IMAGE_PATH_GRASS } from "@bombers/shared/src/idnex";

export default class GrassEntity extends BaseEntity {
    constructor() {
        super(RESOURCE_IMAGE_PATH_GRASS);
    }
}