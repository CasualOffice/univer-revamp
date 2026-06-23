/**
 * Copyright 2026-present CasualOffice.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { ICreateUnitOptions } from '@univerjs/core';
import type { ISlideData, SlideDataModel } from '@univerjs/slides';
import { IUniverInstanceService, UniverInstanceType } from '@univerjs/core';
import { FUniver } from '@univerjs/core/facade';
import { FSlide } from './f-slide';

export interface IFUniverSlidesMixin {
    /** The currently active presentation, or null. */
    getActiveSlide(): FSlide | null;
    /** A presentation by unit id, or null if not loaded. */
    getSlide(id: string): FSlide | null;
    /** Create and load a new presentation unit from snapshot data. */
    createUniverSlide(data: Partial<ISlideData>, options?: ICreateUnitOptions): FSlide;
}

export class FUniverSlidesMixin extends FUniver implements IFUniverSlidesMixin {
    override getActiveSlide(): FSlide | null {
        const model = this._injector.get(IUniverInstanceService)
            .getCurrentUnitOfType<SlideDataModel>(UniverInstanceType.UNIVER_SLIDE);
        return model ? this._injector.createInstance(FSlide, model) : null;
    }

    override getSlide(id: string): FSlide | null {
        const model = this._injector.get(IUniverInstanceService)
            .getUnit<SlideDataModel>(id, UniverInstanceType.UNIVER_SLIDE);
        return model ? this._injector.createInstance(FSlide, model) : null;
    }

    override createUniverSlide(data: Partial<ISlideData>, options?: ICreateUnitOptions): FSlide {
        const model = this._injector.get(IUniverInstanceService)
            .createUnit<ISlideData, SlideDataModel>(UniverInstanceType.UNIVER_SLIDE, data, options);
        return this._injector.createInstance(FSlide, model);
    }
}

FUniver.extend(FUniverSlidesMixin);

declare module '@univerjs/core/facade' {
    // eslint-disable-next-line ts/naming-convention
    interface FUniver extends IFUniverSlidesMixin { }
}
