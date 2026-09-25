# 评分方案

评分方案决定学生能报什么、怎么计分以及总分如何合成。班管在「方案编辑器」维护方案，校验通过后发布为新版本；每条提交都会保存当时小项规则的快照，之后修改方案不会改写已提交记录的计分依据。

仓库中的 [`examples/scoring-scheme.json`](https://github.com/guiguisocute/easy-gpa-plus/blob/main/examples/scoring-scheme.json) 是一份完整的虚构示例，可导入后按本校细则修改。

## 结构

```json
{
  "schemeName": "综合测评示例方案",
  "weights": { "major": 0.6, "moral": 0.15, "practice": 0.15, "health": 0.1 },
  "categories": [
    {
      "key": "moral",
      "name": "思想道德素质",
      "maxTotal": 100,
      "baseItems": [{ "key": "moral_base_law", "name": "遵纪守法", "full": 15 }],
      "penaltyItems": [{ "key": "moral_pen_warning", "name": "警告处分", "per": -15 }],
      "items": [
        {
          "key": "moral_dorm",
          "name": "文明寝室成员",
          "scoreRule": {
            "type": "enum",
            "levels": ["评选级别"],
            "options": [{ "label": "校级文明寝室", "score": 3 }, { "label": "院级文明寝室", "score": 2 }]
          }
        }
      ]
    }
  ]
}
```

| 字段 | 说明 |
| --- | --- |
| `weights` | 各分类在总分中的权重，必须非负且合计为 1 |
| `categories[].maxTotal` | 分类封顶 |
| `categories[].formula` | 可选，以分式展示非累加得分的算法：`lhs`、`numerator`、`denominator` |
| `categories[].note` | 可选，分类说明（Markdown），例如哪些课程计入、等级如何折算 |
| `baseItems` | 基础分项，`full` 为满分，由审核人维护；设置 `studentClaim` 后改为学生凭材料申报 |
| `penaltyItems` | 扣分项，`per` 为单次扣分（负数） |
| `items` | 学生可申报的小项 |

`key` 为 `major` 的分类是**专业素质**：它的分数从成绩数据导入，不接受学生申报。

### 小项字段

| 字段 | 说明 |
| --- | --- |
| `scoreRule` | 计分规则，见下表 |
| `exclusiveGroup` | 互斥组：同组多条只取最高的一条 |
| `capGroup` | 共享上限：`{ "key": "…", "cap": 10 }`，同组小项合计不超过 `cap` |
| `evidence` | 佐证要求：`required`、允许的 `types`、单文件上限 `maxMb` |
| `note` | 小项说明 |
| `activities` | 本学年该小项下的具体活动清单。它属于当年数据，保存为模板时会被去掉 |

## 计分规则

| `type` | 参数 | 期望分 |
| --- | --- | --- |
| `per_unit` | `unit`、`per`、可选 `cap` | 数量 × `per`，超过 `cap` 按 `cap` 计 |
| `enum` | `levels`、`options[{label, score}]` | 所选档位的分数；学生可在 0 与最高档之间调整期望分，例如只任职一学期 |
| `free` | 可选 `min`、`max` | 学生自报，须在范围内 |
| `threshold` | `unit`、`minimum`、`award` | 数量达到 `minimum` 得 `award`，否则为 0 |

`levels` 用于把多维档位（如「竞赛级别 · 获奖等次」）展示为逐级选择。期望分只是学生的预期，认定分由审核给出。

## 分类得分的计算顺序

后端结算器按固定顺序计算，不可配置、不经模型：

1. 单项封顶：`per_unit` 的 `cap`
2. 互斥组：同组只保留最高分（同分取较早的一条）
3. 共享上限：`capGroup` 合计封顶
4. 加上基础分与扣分
5. 分类封顶：`maxTotal`

总分为各分类得分乘以权重之和。分数以千分之一分为单位做定点运算，重复结算的结果逐字节一致。

## 模板

运维可以在「模板库」上架方案模板，供新班级选用。模板只保留评分规则，不含当年的活动清单。
