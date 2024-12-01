<template>
  <template v-for="(question, questionIdx) of questions" :key="question.idx">
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col class="d-flex">
                <v-radio-group
                  v-model="question.type"
                  inline
                  hide-details
                  @change="onchangeType(questionIdx)"
                >
                  <v-radio label="単一選択" value="SingleSelection" />
                  <v-radio label="複数選択" value="MultipleSelection" />
                  <v-radio label="自由記述" value="FreeText" />
                </v-radio-group>
                <v-btn
                  color="red"
                  :disabled="questions.length === 1"
                  @click="removeQuestion(questionIdx)"
                  >削除</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="質問文"
                  v-model="question.questionaire"
                  :rules="[required]"
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <template v-if="question.type === 'SingleSelection'">
                  <v-list>
                    <v-list-item
                      v-for="(option, optionIdx) of question.options"
                      :key="optionIdx"
                      prepend-icon="mdi-radiobox-blank"
                    >
                      <v-list-item-action>
                        <v-text-field
                          :label="`選択肢${optionIdx + 1}`"
                          v-model="option.label"
                          :rules="[required]"
                          hide-details
                        ></v-text-field>
                        <v-btn
                          icon
                          :disabled="question.options.length === 1"
                          @click="removeOption(questionIdx, optionIdx)"
                          class="mx-5"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                  <v-btn color="blue" @click="addOption(questionIdx)">選択肢を追加する</v-btn>
                </template>
                <template v-else-if="question.type === 'MultipleSelection'">
                  <v-list>
                    <v-list-item
                      v-for="(option, optionIdx) of question.options"
                      :key="optionIdx"
                      prepend-icon="mdi-checkbox-blank-outline"
                    >
                      <v-list-item-action>
                        <v-text-field
                          :label="`選択肢${optionIdx + 1}`"
                          v-model="option.label"
                          :rules="[required]"
                          hide-details
                        ></v-text-field>
                        <v-btn
                          icon
                          :disabled="question.options.length === 1"
                          @click="removeOption(questionIdx, optionIdx)"
                          class="mx-5"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                  <v-btn color="blue" @click="addOption(questionIdx)">選択肢を追加する</v-btn>
                </template>
                <template v-else-if="question.type === 'FreeText'">
                  <v-textarea label="回答欄" disabled />
                </template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>
</template>

<script setup lang="ts">
import { useSurveyStore } from '@/stores/surveyStore'
import { storeToRefs } from 'pinia'

const surveyStore = useSurveyStore()
const { questions } = storeToRefs(surveyStore)

const required = (v: string) => !!v || false

const removeQuestion = (questionIdx: number) => {
  questions.value.splice(questionIdx, 1)
}

const onchangeType = (questionIdx: number) => {
  questions.value[questionIdx].options = []
  addOption(questionIdx)
}

const addOption = (questionIdx: number) => {
  questions.value[questionIdx].options.push({
    label: '',
  })
}

const removeOption = (questionIdx: number, optionIdx: number) => {
  console.log(optionIdx)
  questions.value[questionIdx].options.splice(optionIdx, 1)
}
</script>
