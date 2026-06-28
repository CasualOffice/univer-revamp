/**
 * Copyright 2023-present DreamNum Co., Ltd.
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

import { DataValidationOperator } from '@univerjs/core';

export const TimeOperatorNameMap: Record<DataValidationOperator, string> = {
    [DataValidationOperator.BETWEEN]: 'sheets-data-validation.time.operators.between',
    [DataValidationOperator.EQUAL]: 'sheets-data-validation.time.operators.equal',
    [DataValidationOperator.GREATER_THAN]: 'sheets-data-validation.time.operators.greaterThan',
    [DataValidationOperator.GREATER_THAN_OR_EQUAL]: 'sheets-data-validation.time.operators.greaterThanOrEqual',
    [DataValidationOperator.LESS_THAN]: 'sheets-data-validation.time.operators.lessThan',
    [DataValidationOperator.LESS_THAN_OR_EQUAL]: 'sheets-data-validation.time.operators.lessThanOrEqual',
    [DataValidationOperator.NOT_BETWEEN]: 'sheets-data-validation.time.operators.notBetween',
    [DataValidationOperator.NOT_EQUAL]: 'sheets-data-validation.time.operators.notEqual',
};

export const TimeOperatorTitleMap: Record<DataValidationOperator | 'NONE', string> = {
    [DataValidationOperator.BETWEEN]: 'sheets-data-validation.time.ruleName.between',
    [DataValidationOperator.EQUAL]: 'sheets-data-validation.time.ruleName.equal',
    [DataValidationOperator.GREATER_THAN]: 'sheets-data-validation.time.ruleName.greaterThan',
    [DataValidationOperator.GREATER_THAN_OR_EQUAL]: 'sheets-data-validation.time.ruleName.greaterThanOrEqual',
    [DataValidationOperator.LESS_THAN]: 'sheets-data-validation.time.ruleName.lessThan',
    [DataValidationOperator.LESS_THAN_OR_EQUAL]: 'sheets-data-validation.time.ruleName.lessThanOrEqual',
    [DataValidationOperator.NOT_BETWEEN]: 'sheets-data-validation.time.ruleName.notBetween',
    [DataValidationOperator.NOT_EQUAL]: 'sheets-data-validation.time.ruleName.notEqual',
    NONE: 'sheets-data-validation.time.ruleName.legal',
};

export const TimeOperatorErrorTitleMap: Record<DataValidationOperator | 'NONE', string> = {
    [DataValidationOperator.BETWEEN]: 'sheets-data-validation.time.errorMsg.between',
    [DataValidationOperator.EQUAL]: 'sheets-data-validation.time.errorMsg.equal',
    [DataValidationOperator.GREATER_THAN]: 'sheets-data-validation.time.errorMsg.greaterThan',
    [DataValidationOperator.GREATER_THAN_OR_EQUAL]: 'sheets-data-validation.time.errorMsg.greaterThanOrEqual',
    [DataValidationOperator.LESS_THAN]: 'sheets-data-validation.time.errorMsg.lessThan',
    [DataValidationOperator.LESS_THAN_OR_EQUAL]: 'sheets-data-validation.time.errorMsg.lessThanOrEqual',
    [DataValidationOperator.NOT_BETWEEN]: 'sheets-data-validation.time.errorMsg.notBetween',
    [DataValidationOperator.NOT_EQUAL]: 'sheets-data-validation.time.errorMsg.notEqual',
    NONE: 'sheets-data-validation.time.errorMsg.legal',
};
