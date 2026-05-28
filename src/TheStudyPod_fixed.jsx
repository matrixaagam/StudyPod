import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & BRANDING
═══════════════════════════════════════════════════════════ */
const APP = { name: "The Study Pod", by: "by Aagam Shah", tagline: "Your AI-powered study ecosystem" };
const ADMIN = { email: "matrix.aagam@gmail.com", password: "Parshva@23" };
const INTERVALS = [1, 3, 7, 15, 30];

const SUBJECTS = {
  english:   { name:"English Core",        short:"ENG", pastel:"#fef3c7", accent:"#b45309", ring:"#fcd34d", icon:"📖" },
  accounts:  { name:"Accountancy",         short:"ACC", pastel:"#dbeafe", accent:"#1e40af", ring:"#93c5fd", icon:"📊" },
  bst:       { name:"Business Studies",    short:"BST", pastel:"#ede9fe", accent:"#5b21b6", ring:"#c4b5fd", icon:"💼" },
  economics: { name:"Economics",           short:"ECO", pastel:"#d1fae5", accent:"#065f46", ring:"#6ee7b7", icon:"📈" },
  maths:     { name:"Applied Mathematics", short:"MTH", pastel:"#ffe4e6", accent:"#9f1239", ring:"#fda4af", icon:"🔢" },
};

const SYLLABUS = {
  english:[
    {id:"e1",name:"The Last Lesson",unit:"Flamingo — Prose"},
    {id:"e2",name:"Lost Spring",unit:"Flamingo — Prose"},
    {id:"e3",name:"Deep Water",unit:"Flamingo — Prose"},
    {id:"e4",name:"The Rattrap",unit:"Flamingo — Prose"},
    {id:"e5",name:"Indigo",unit:"Flamingo — Prose"},
    {id:"e6",name:"Poets and Pancakes",unit:"Flamingo — Prose"},
    {id:"e7",name:"The Interview",unit:"Flamingo — Prose"},
    {id:"e8",name:"Going Places",unit:"Flamingo — Prose"},
    {id:"e9",name:"My Mother at Sixty-Six",unit:"Flamingo — Poetry"},
    {id:"e10",name:"An Elementary School Classroom",unit:"Flamingo — Poetry"},
    {id:"e11",name:"Keeping Quiet",unit:"Flamingo — Poetry"},
    {id:"e12",name:"A Thing of Beauty",unit:"Flamingo — Poetry"},
    {id:"e13",name:"A Roadside Stand",unit:"Flamingo — Poetry"},
    {id:"e14",name:"Aunt Jennifer's Tigers",unit:"Flamingo — Poetry"},
    {id:"e15",name:"The Third Level",unit:"Vistas"},
    {id:"e16",name:"The Tiger King",unit:"Vistas"},
    {id:"e17",name:"Journey to the End of Earth",unit:"Vistas"},
    {id:"e18",name:"The Enemy",unit:"Vistas"},
    {id:"e19",name:"On the Face of It",unit:"Vistas"},
    {id:"e20",name:"Memories of Childhood",unit:"Vistas"},
    {id:"e21",name:"Notice & Poster Writing",unit:"Writing Skills"},
    {id:"e22",name:"Formal Letter Writing",unit:"Writing Skills"},
    {id:"e23",name:"Article Writing",unit:"Writing Skills"},
    {id:"e24",name:"Report Writing",unit:"Writing Skills"},
    {id:"e25",name:"Speech Writing",unit:"Writing Skills"},
    {id:"e26",name:"Reading Comprehension",unit:"Grammar"},
  ],
  accounts:[
    {id:"a1",name:"Partnership Fundamentals",unit:"Partnership"},
    {id:"a2",name:"Goodwill: Nature & Valuation",unit:"Partnership"},
    {id:"a3",name:"Change in Profit Sharing Ratio",unit:"Partnership"},
    {id:"a4",name:"Admission of a Partner",unit:"Partnership"},
    {id:"a5",name:"Retirement of a Partner",unit:"Partnership"},
    {id:"a6",name:"Death of a Partner",unit:"Partnership"},
    {id:"a7",name:"Dissolution of Partnership",unit:"Partnership"},
    {id:"a8",name:"Issue of Shares",unit:"Company Accounts"},
    {id:"a9",name:"Forfeiture & Reissue of Shares",unit:"Company Accounts"},
    {id:"a10",name:"Issue of Debentures",unit:"Company Accounts"},
    {id:"a11",name:"Redemption of Debentures",unit:"Company Accounts"},
    {id:"a12",name:"Financial Statement Analysis",unit:"Financial Analysis"},
    {id:"a13",name:"Ratio Analysis",unit:"Financial Analysis"},
    {id:"a14",name:"Cash Flow Statement",unit:"Financial Analysis"},
  ],
  bst:[
    {id:"b1",name:"Nature & Significance of Management",unit:"Management"},
    {id:"b2",name:"Principles of Management",unit:"Management"},
    {id:"b3",name:"Business Environment",unit:"Business Environment"},
    {id:"b4",name:"Planning",unit:"Functions of Management"},
    {id:"b5",name:"Organising",unit:"Functions of Management"},
    {id:"b6",name:"Staffing",unit:"Functions of Management"},
    {id:"b7",name:"Directing",unit:"Functions of Management"},
    {id:"b8",name:"Controlling",unit:"Functions of Management"},
    {id:"b9",name:"Financial Management",unit:"Finance & Marketing"},
    {id:"b10",name:"Financial Markets",unit:"Finance & Marketing"},
    {id:"b11",name:"Marketing Management",unit:"Finance & Marketing"},
    {id:"b12",name:"Consumer Protection",unit:"Consumer Protection"},
    {id:"b13",name:"Entrepreneurship Development",unit:"Entrepreneurship"},
  ],
  economics:[
    {id:"ec1",name:"Introduction to Microeconomics",unit:"Microeconomics"},
    {id:"ec2",name:"Consumer's Equilibrium",unit:"Microeconomics"},
    {id:"ec3",name:"Demand Analysis",unit:"Microeconomics"},
    {id:"ec4",name:"Elasticity of Demand",unit:"Microeconomics"},
    {id:"ec5",name:"Supply Analysis",unit:"Microeconomics"},
    {id:"ec6",name:"Elasticity of Supply",unit:"Microeconomics"},
    {id:"ec7",name:"Market Equilibrium",unit:"Microeconomics"},
    {id:"ec8",name:"Market Forms",unit:"Microeconomics"},
    {id:"ec9",name:"Introduction to Macroeconomics",unit:"Macroeconomics"},
    {id:"ec10",name:"National Income Accounting",unit:"Macroeconomics"},
    {id:"ec11",name:"Money & Banking",unit:"Macroeconomics"},
    {id:"ec12",name:"Government Budget & Economy",unit:"Macroeconomics"},
    {id:"ec13",name:"Balance of Payments",unit:"Macroeconomics"},
    {id:"ec14",name:"Foreign Exchange Rate",unit:"Macroeconomics"},
  ],
  maths:[
    {id:"m1",name:"Numbers & Quantification",unit:"Algebra"},
    {id:"m2",name:"Matrices",unit:"Algebra"},
    {id:"m3",name:"Determinants",unit:"Algebra"},
    {id:"m4",name:"Differentiation",unit:"Calculus"},
    {id:"m5",name:"Applications of Differentiation",unit:"Calculus"},
    {id:"m6",name:"Integration",unit:"Calculus"},
    {id:"m7",name:"Differential Equations",unit:"Calculus"},
    {id:"m8",name:"Probability Distributions",unit:"Statistics"},
    {id:"m9",name:"Inferential Statistics",unit:"Statistics"},
    {id:"m10",name:"Index Numbers",unit:"Statistics"},
    {id:"m11",name:"Time Series Analysis",unit:"Statistics"},
    {id:"m12",name:"Financial Mathematics",unit:"Financial Maths"},
    {id:"m13",name:"Linear Programming",unit:"Linear Programming"},
  ],
};

const ACHIEVEMENTS = [
  {id:"first_chapter", icon:"🌱", title:"First Step", desc:"Study your first chapter", xp:50},
  {id:"streak_7",      icon:"🔥", title:"Week Warrior", desc:"Maintain a 7-day streak", xp:150},
  {id:"streak_30",     icon:"⚡", title:"Unstoppable", desc:"30-day study streak", xp:500},
  {id:"revisions_10",  icon:"🔁", title:"Revision Pro", desc:"Complete 10 revisions", xp:100},
  {id:"mastered_5",    icon:"🏆", title:"Chapter Master", desc:"Master 5 chapters", xp:200},
  {id:"score_90",      icon:"⭐", title:"High Achiever", desc:"Score 90%+ on a test", xp:250},
  {id:"flashcards_50", icon:"🃏", title:"Memory King", desc:"Complete 50 flashcards", xp:150},
  {id:"pomodoro_20",   icon:"⏱", title:"Focus Beast", desc:"Complete 20 Pomodoro sessions", xp:200},
  {id:"all_subjects",  icon:"🎯", title:"Renaissance", desc:"Study all 5 subjects in one day", xp:300},
  {id:"quiz_perfect",  icon:"💎", title:"Perfect Mind", desc:"Score 100% on an AI quiz", xp:400},
];

const MOCK_USERS = [
  {id:1,name:"Rahul Sharma",email:"rahul.s@gmail.com",avatar:"RS",chapters:23,streak:12,studyTime:87,aiUsage:34,score:84,active:true,joined:"2025-01-10",lastActive:"Today"},
  {id:2,name:"Priya Patel",email:"priya.p@gmail.com",avatar:"PP",chapters:51,streak:28,studyTime:210,aiUsage:78,score:93,active:false,joined:"2025-01-05",lastActive:"Yesterday"},
  {id:3,name:"Karan Mehta",email:"karan.m@gmail.com",avatar:"KM",chapters:34,streak:8,studyTime:145,aiUsage:52,score:79,active:true,joined:"2025-01-12",lastActive:"Today"},
  {id:4,name:"Sneha Joshi",email:"sneha.j@gmail.com",avatar:"SJ",chapters:62,streak:41,studyTime:320,aiUsage:112,score:97,active:false,joined:"2024-12-28",lastActive:"2 days ago"},
  {id:5,name:"Arjun Singh",email:"arjun.s@gmail.com",avatar:"AS",chapters:18,streak:3,studyTime:45,aiUsage:15,score:71,active:false,joined:"2025-01-20",lastActive:"3 days ago"},
  {id:6,name:"Ananya Nair",email:"ananya.n@gmail.com",avatar:"AN",chapters:44,streak:19,studyTime:178,aiUsage:67,score:91,active:true,joined:"2025-01-08",lastActive:"Today"},
];

const QUOTES = [
  "Excellence is not a destination but a continuous journey.",
  "Every chapter mastered is a step closer to 97%.",
  "Discipline today creates freedom tomorrow.",
  "Study smart. Revise often. Trust the process.",
  "Your future self is watching — make them proud.",
  "Consistency is the only shortcut that actually works.",
];

const LOGO_SM="data:image/png;base64,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";
const LOGO_TY="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAATIUlEQVR42u1ceXBd5XU/53zffbuWp122hbAtWcYbxsbGBsxmtlCaTJM0lJRJmKRDpkmZZqZJ03QmacsfbbrkjzRtk6YN6ZCkSdrSacukQ2cChASMwcYrGNnGm2zt0tN7enrvbt93Tv+47wnZLCOjJ2w6vaORpavrd7/fd875nfVeJCJYtAMRReTtfr0kh0JEeL8dC1kzvR+hLkRN6PIX1NzLIqgLkfD7UqUXctD/PUjvLML/g4Df2cL1e7/9iIhIACDCIvIeOyr9XqqZtTb6rXraRH8iIhEAeC+QLzppRQK11opIMplsbW3ruqL305/9/IreNVMTE1prY0JjjIgsagj0Hkk4ggoAnR0d7e1tgMpayGSXdK9cHbBK1zelM3XtHVcEYTgxNlTIjxMhIi2qkuPi7WuENpNJr7tqlef554ZG8oWiMQZJ1dW3+IEXuEUA0Vo3NLZ2LO0VgP7Du9gGpNTiYV4slY7QdrS1blrfd2pg4OSps6WyK8JEKGyz9SkTukEQIIKIlEvF3MRoQ/MVG7feMTo0EHglIrVIJr0ogCO0bS3N123sO/Rq/8h43jIDIJHWWjNDR0eHNez5vlKKWQQFgKcmhuLp1ls+cN+p4/02KAHiu8N8CfywiCQT8Zu2rj158tT41IyxrJSOxWKO42gdI+Uk03XxREapuHYSjpPQyhEBZu/YoWfGRic/9MDvMWQU6QuWPk/ZvLM51F7CipS1ducNmxwwB44OlL0gFosrpYmIFGnHMYbvuvejhmnw3EAsnkAAJEVAAGCNNzk+sXnHBwX12ZOvOk5kzHMA4ByndlmElogitruzZcu65WeHxwolPxZzlCIiJCKtdBAEJvQGB04UpiYFyDKiiqFylHaUcohoJndi34vPbr3pnkRmKYKKQpTzJXjZAEaAmFbEvPPGTfXp+JnhKQTUWiOCInQcxw+C3t5VG6+59sjh/ePjuZXr72lfvgMwrshBckg5Ssct23Ov70WVuLJvY2gUoT4P84KJrKaACR2FzfXOjVvWFQrFyULZcVQUSAFCPp/bvn3bhvVr+/pW3XzLbSU/9rt/8Ec37PyIHxAzAylARaQRYHry9NjI0Iq+zUwJUg4i1dDuqIbMrBQpgmXt2RXdS8Zz09ay1goRWSSRSH78/vt33nrTE0888ZMf/yCeSG3btuEbj/zOfz72V82dPUtW3UWxZgAiJFKO7+anJoayrcucWCOSRlA1XCfVUJ81gkbpaM2mM6li2QNAQtSKTBDcesuOPXv3/NOjj27YcLVScdctW386rn3C8sbrbn/wc19BakSMICsQnilMOsnGeCoLQEgK4XKTMCISKkUOYWMmjgiVygShtTbbWNdzRSchpevqx8fHGrNZa8Lp/NRULqcUuZNHv/HVT6IZJyQBRCAAtJaVjiudIHQQCZDegr0uCeDIuBBAEShCrUlp0kQAAiCKKAi8bVuu+dnTzy5pb06n09dsvFrE5qZypZkCi3RdsfTo4efGB1/2QxZqQHQAEZCYWVCRkwDSiBoBayWbhSYPkZNHBELURI6ShKOoWo4lEE2YTsZPnhmcLs4EYThdKPT19moVy+XGXS+YHD+bqW9bt/nuHXc/ePLUwFP/9jWFwAICCICIDpACQEBEqU2oqWtkwIiIRKCVcrQSEAQAEGtMY309kspPFz/8K3e8uP+VfD4/MZlb2eOkM1nteKlMNpVKTQwfPbj7v3P5EpEIV3eSRQAQlSAigCAgvPHnSwkYq1+EqAi1IiKc1XjPdRvSseZs3djEpOf5xZmS57pXXmnC0He9sgDmp3K5ieGRoRNE8XgiaSyDsIggKayoMQEgAkrlPnKJSSuq2BAiIRICIc2Gf4jgB+Znzzx3583XvbD3oDWmZ8WVK1b0xOKJQn5SqdjE+Mj2nZ/81Bd/mMn2OTEtbKtFH0UUuV9CQKgwlszivwxYGgEREMkyswggAAizxGLOyYHR0kypa0l7MpnIF6ZfP3GskM/X1TXmJiaspcP7X5iZnojQCHCV35EFgTQgARJgJN4KF86S5eKq9Nt1hiJPQoiIAAjWsjGWmRGBECxzIh7b9dKBnpXLm5rb9r96HAAy9Vnfpnbc+/DR144dev6xgWNPxZMN0RaRUtYaYdaOQ6SxIk+KXLFUVfpdFwjoYghZ3tY1RbmrgAj4ofW80HFiIuL7gVakFBVK7nN7Dh08/Ep7c0Nf39pMJnP65BEQaGnrUMpJpjLCBhFI6yAoI5Jy4swRG0ZmG9X4ZOHpUg1Iq+qZEBBYxDAUZ8qZdOprf/rI333zbwaGxzRBPJmoc5yzwyNjEzkr4Di6tSX7r9/9IkAykYyLiAB7bhEArr1u53Xbtz+9e1gpEpGqYKXKjwv1TbUgrYoTQhFhkTA0gnTi5Eklwe5dTz7y5YfXrunzvLA448acuCAGQVBfVwcgRE4q5YSh57kFTbB9x12PfP3Hf/bNH+57eQ+bkAAAWIBn67pYi3RJL5yuIgIREBG0DL7hILAM+tvfeTTMD2Uz6Ycf/Mjg6OQv97zy/Iv7g8BHRGYjwghYLs+0tnfcsOPuNRu2gE68fvzks089efDl53s2fzwMA2ALwjDrmitoL6lbQoCKgCuYwVgx1rJIOpXcev31nh8884td/UePrVjW9rEP3tXd3S0ivucbEwrYLVtv/MC9v6GdxJ7dvzy097m2tparN20CBGHL1rAYqQBmeEOrL7UNVzyKRF/CDGFoEon4kT1Hf/C9761e3dvckM4V3HPnBmdcu7pnhQnNRG7S8931GzY1Nbce6z+Sqc8mU/WxRGZwcPDJ//heuTRDiNaGYMOoHRMRIgAAXOpIS0QAK/zMAixgq+0ii3huZLyvZ9n4+PjQWN4zEDKUXD+dSuULxeamJgIYGhxw4nUjQ4NOfKq5oyfmGbec00oJh9b4wgEIAwigLBhpLW04igYEQFjAWI7FtCIUkd37j4+OTtbVp8dyJd+IiFhB0nFjQs/lMAx837CgAKJKDA8PjZw9BABKkbWmitkgRJFMbbIH/W5hVoMQkVkbZgEAdMtlTdDUkAYAVvrM+LSMTXsBszAAaKW0jiXqut3Q96ZGwjC0bACQSCGiUg6zAaB4st4tTpmgAMAiXL2LXLJYem4QIiAiwiyWBZDGJ6fyhem1vd2I6AfWC9n1rWWxApbBD03JLe+49YPtnctdr8wS9ROF2TBXLJZUsqGpc3L0dBiUQFiEI/UR4cvCD4ugAIpAhLnkBodfO7G278r2bIqFI/EAgkJSCuvq2zuXrn39yM+KUwNd3RuJNFGlZRzFVQiQrFvS1NI+dPoIQWg5ELBVn1QDnabakHRULxcJjQXSP//li6m67J3b10i0zGrcYC1n6rKr120tl/JK0TVbbjImtJbPj9qoe/WNmoKzJw4qxcAWONIhqclqa9B5iDr6iKAQo9rlVG5KxdO/dufWn+86UCj5RIQIzHLDbQ+Wi+MTw68gkuuWxkdOX7lyS0v78vGRE0QKEJi5oXXNTXfdv//5/xofOaWI2fqRHxYQqAVT10SlI/cohsWy+AGrWPwnj/90cMo+/MAdqbi21iKgiJQLAyYsIkIYhsyGhYOg4Lm5ioe1NpZs2X7HA/nR/v6Du+IxYutL1cHXqplYm94SVhLiiu9AUtbyrr2v3nnbjrYMHT096gUGAJSUXLcIgMLsB4HWznR+rDyT9zwXURLJ1mtvfqC1Kf7Tf/lbx1HMRjhE5qoL5ssIcFSRwEqaLiKglDM9XXxh/7Et16xb1pKayJdKnp9OpT3PB4HQGGvM7ExLEAQN2a71W+6pz8iTj39LmAkJJARhFhHgGvbHazYBQFFJhkAhKgRCVEqVXA+Vs+PaNfUpfXJgdHiyWPYDtiKI1ljtxABAx1LpuraOJT3l0lj/oV1ax0lrYQGJXHe0K3bhhYqaAY5ugNWaVtQJqtZA0DfGD2xrU2NXRxMRzpSDsh8aBmbUOo4q7sRTYRBMjA+45aKjk0RUpXyoxqlSK32G2s54EBGCRH4VEAiqmSOz64cAoLVOxh1HO4IIgJYhNMb3ysyMSNqJoZBUcwVArjnaGgOuDp0BYdStr/BDtGwWMNYK81vYAunKxUJRmDGnNi21HfbQFwtpblw5q8xVVFF0jRIx9oXzR6iIgC44O5vfCgC+CW0tZXseS8+Tq5k5Qjj3e3RyVsKzxZi5NQKYU1nF84637v0yc401uXqXi3NLnZ0dmXS6VCo7jmOMicVizJxOp1uamz3PO2+YGbFaj0GpZo/n3yuqM/MF2yPytklCTTyonv8OWWu7li4JQzM8Mtq3qqcp21ScKe7bf/CajRtAZHRs7IJcChFnJyjljYj7vDLJXJgAWJWqXFydePFs+OzgoLAQkbXW89zA94mIrdVaEaG1MisEEal2iaHaNIG5s7NRdA0AiMwVJqvkuhGPCsBchqucnPMJbz6zKCwdLY6QWFgRWWYASMTjnu9HLlRElFIiwszRh3MUDlfGIpSIRAOYF1x2wS1mL4A5M5tzhzFnL9NaM/PFkdZ8VJqZM5n05o1ru5Z0FmdKQRg6jnPNhrUtzdmOjjbHiU0Xi47WTc1N5bILAK0tzZ7vi0gqld6wfl3XsqVTU3nf9xGxob4+U5cplUoi0tXVNTMzM2uiiHT1xutW9qxxYrHc5Fhly5g3bb5+Ze+acwNnLJvI561Zu6m3dx2LFPK5+YvtIkgrk0p+4eFPB4FpaKgbHZ+YLs6kUskbtl/7qU/cl21qGh4ZHRwabm5u+txDDz7zi+cR8UtfePjlfQdcz7vz9pt/8/5fR6U+ft9H+/uPTU3lM3WZr3z595/++bM7b9u5bdt1L720pypMQVQ33HjLsqXtt952t+u6586eRsSHPvvF1Veta2rK3vOrH9nz0nNhELS1dX71kT8P/dJd93xYa3382BE1v5HUeQGOPFAymbzzlm2Hjxw9cXLgxKkBIgpDc/Dwkdamhu//6PHjJ04BQCIR33z1mud37yWiG7Zu3L13v+8HV/X19L/22j//5PHcZO7eu3c+98JL5bI7MTHx8G9/pq6+/u+/8w9zn+US4SOvHj5w4EAi09HWsfSVgy/1rbl2ec+Gv/76V/a89HxT67IlXStfP3oo29KmEs3f/fZfPvPU/3zoYw8d3Lcr8L35zIHMSxOi6e18YfqP/+JbQWhuv2Xb/R++h5kdRyultKbGhvpZ3SOwltkYgxxaYwEg9L0wDADA88pB4AFAMpHYu+/A9HT+6aef9ryK8UfbGo8nP/+H3/rEQ19OpBqf+PfHACA0MpYLo5Xk8qEfKAAIQynOMAAIh5P5i2gm6nlzlWitr792gwhba0rlcrQR1lq2bJkj/PnCdD5f+MwnP6qIhkbHS2UXAMIguP3m7U2NdWtW9/7j9x8nIstMiGfOnHHLZUSM2Diq48fiqdGRoR89+idV3tInj+1bt+mOe+/7UnmmsLT7qscf+yoi+p7btmT9zXf/1tLu9a8cfK5cmp4ndV0ESyPi1Wt606nEVGHmlf7XZ/9jc7ahOFMOwnA2L9u2eb1lfvHlw5FdpVPJ1b3LEeHV/hOlsqu1ijpvzdnGUtn1fG829hARUrquvrlYGEckZhv1gpl51dobY/F0/6FnjAkiP7e0e3060zg+emZi9JSa90z5xbmlNzuM6GQUJc6q5ZsDjwUU+RGiwQJr4Y0nQs5zS0prmbdbujjA1YslihnmRnxEhEjMTARKKUIEASQkRK2VVooUIpJSylHqps2r8tPFg8dHWMAwczVNsAJsmQWsNWyZhdlaZsNsq67RzrkvVfeXFyvSeksjqe63INroB2ap5IkWEdFYSxQNgCAhOVqdOjtccv3pmRJzRR2q/0I1E4mqOzybIb45oKoMNl3CfLjaCqmsbk6YOS/FRqyMYWHUZZfZUASgdrOW5/thhIXlKDhr4alU0hgTVaQBYFXPCmYJw0BrRURKqaiZJADxeGzZ0o7W5qYlne1BaCpZFWIqlTTGVjoSC8yc5nwGzccJX1TaycytLU1aqUj/reWVy7tTyWSxWLSWw9AYY8IwNCa01jbUZZZ3d01Pz5w5OzSZy7e2NIfGGGM62tsS8XhEh7XMnBD1hSq5oOo0MHO2of7GrVefHRw9c254dHzypuu3BEHY2tqcTsVDY1LJpB+EMccpld3+YycymYyIOFp3tLV0Le10YrFsfToej9fX1+07eETV6gGmOWlojWtazLyko+3Krs5EIrl778HGhvp43JkpleOxmGXetGHt6ydPz5Rcx1GF6RnX9VzPa21pXt27PBZzBs4NT0xOJZOJ+rp0Llcoua7nevKuarHvVHWr7ZNplSeWWluCIMgXpjvaWscmJuOxmOt5nR1t2caGI/3HLyj6NTdl06nkwLkhfqv6Xs1rWvMFPP8dna1yKaWstVGcQERaa98PlKILzLCSYNNbFLcW44G8RXn2cLa+MXeb5jqqd6iELvbxFumhvOkJg5q0VGtef6wZ4Mv5LQizKvOuYV8Wb3l4L9dwWbz04G2mknExtvX/3+PxflbXywLwJX+90jwB11wsl4uc/xe/Ofvii0inwAAAAABJRU5ErkJggg==";

/* ═══════════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════════ */
const todayStr = () => new Date().toISOString().split("T")[0];
const addDays   = (d,n) => { const x=new Date(d); x.setDate(x.getDate()+n); return x.toISOString().split("T")[0]; };
const greet = (name='') => {
  const h=new Date().getHours();
  const time=h<12?'Good morning':h<17?'Good afternoon':h<21?'Good evening':'Good night';
  return name ? `${time}, ${name}` : time;
};
const pct       = (a,b) => b>0?Math.round(a/b*100):0;
const initChapters = () => {
  const r={};
  Object.keys(SYLLABUS).forEach(sub=>{
    r[sub]=SYLLABUS[sub].map(ch=>({...ch,subject:sub,status:"pending",studiedDate:null,revisionIndex:0,nextRevision:null,revisionHistory:[]}));
  });
  return r;
};

// Build an empty 364-day grid — counts come from real activity
const buildHeatmapGrid = () => {
  const days=[];
  for(let i=363;i>=0;i--){
    days.push({date:addDays(todayStr(),-i),count:0});
  }
  return days;
};

// Merge real activity into the grid
const mergeActivity = (grid, activityMap) => {
  return grid.map(d=>({...d,count:activityMap[d.date]||0}));
};

async function callClaude(messages,system="") {
  const body={model:"claude-sonnet-4-20250514",max_tokens:1200,messages};
  if(system) body.system=system;
  try{
    const r=await fetch("/api/groq",{
      method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)
    });
    const d=await r.json();
    return d.content?.[0]?.text||"Unable to get response. Please try again.";
  }catch(e){
    return "Network error. Please check your connection and try again.";
  }
}

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GS = memo(() => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Cinzel+Decorative:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased}
    :root{
      --bg:#07070d;--surf:#0e0e18;--card:#13131f;--card2:#18182a;
      --brd:rgba(255,255,255,0.07);--brd2:rgba(255,255,255,0.12);
      --txt:#f0f0ff;--txt2:rgba(240,240,255,0.55);--txt3:rgba(240,240,255,0.3);
      --acc:#7c3aed;--acc2:#4f46e5;--acc3:#06b6d4;
      --grn:#10b981;--amb:#f59e0b;--ros:#ef4444;
      --glass:rgba(255,255,255,0.04);--glass2:rgba(255,255,255,0.07);
    }
    .light{
      --bg:#f8f7f5;--surf:#ffffff;--card:#ffffff;--card2:#f3f2ef;
      --brd:rgba(0,0,0,0.08);--brd2:rgba(0,0,0,0.14);
      --txt:#0a0a14;--txt2:rgba(10,10,20,0.55);--txt3:rgba(10,10,20,0.3);
      --glass:rgba(0,0,0,0.03);--glass2:rgba(0,0,0,0.05);
    }
    html,body,#root{height:100%;background:var(--bg);color:var(--txt);font-family:'Inter',sans-serif}
    ::-webkit-scrollbar{width:3px;height:3px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:var(--brd2);border-radius:99px}
    button{cursor:pointer;font-family:'Inter',sans-serif;border:none}
    input,textarea,select{font-family:'Inter',sans-serif;outline:none}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes gradMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes blink{0%,80%,100%{opacity:.15}40%{opacity:1}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(.95)}}
    @keyframes orb2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-25px,30px) scale(1.08)}66%{transform:translate(20px,-10px) scale(.93)}}
    @keyframes orb3{0%,100%{transform:translate(0,0)}50%{transform:translate(15px,20px)}}
    .fi{animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both}
    .fd{animation:fadeIn .3s ease both}
    .si{animation:scaleIn .35s cubic-bezier(.22,1,.36,1) both}
    .hov{transition:all .18s ease}
    .hov:hover{opacity:.8}
    .card-hov{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
    .card-hov:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(124,58,237,.12);border-color:var(--brd2)!important}
    .glow{box-shadow:0 0 20px rgba(124,58,237,.25)}
    input[type=range]{-webkit-appearance:none;width:100%;height:3px;background:var(--brd2);border-radius:99px;outline:none}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:var(--acc);border-radius:50%;cursor:pointer}
    .skeleton{background:linear-gradient(90deg,var(--glass) 25%,var(--glass2) 50%,var(--glass) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
    textarea:focus,input:focus{border-color:var(--acc)!important}
    .d1{animation:blink 1.4s .0s infinite}
    .d2{animation:blink 1.4s .2s infinite}
    .d3{animation:blink 1.4s .4s infinite}
    /* Premium smooth scrolling */
    html{scroll-behavior:smooth}
    /* Focus mode overlay */
    .focus-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:999;display:flex;align-items:center;justify-content:center}
    /* Card entrance stagger */
    .stagger-1{animation-delay:.05s}
    .stagger-2{animation-delay:.10s}
    .stagger-3{animation-delay:.15s}
    .stagger-4{animation-delay:.20s}
  `}</style>
));

/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════ */
const Btn = memo(({children,onClick,disabled,variant="primary",size="md",full,style={},...p}) => {
  const s={
    primary:{bg:"linear-gradient(135deg,#7c3aed,#4f46e5)",color:"#fff",border:"none",shadow:"0 4px 15px rgba(124,58,237,.35)"},
    secondary:{bg:"var(--glass2)",color:"var(--txt)",border:"1px solid var(--brd2)",shadow:"none"},
    ghost:{bg:"transparent",color:"var(--txt2)",border:"none",shadow:"none"},
    danger:{bg:"rgba(239,68,68,.12)",color:"#ef4444",border:"1px solid rgba(239,68,68,.25)",shadow:"none"},
    success:{bg:"rgba(16,185,129,.12)",color:"#10b981",border:"1px solid rgba(16,185,129,.25)",shadow:"none"},
    outline:{bg:"transparent",color:"var(--acc)",border:"1px solid var(--acc)",shadow:"none"},
  };
  const sz={sm:{padding:"5px 12px",fontSize:11},md:{padding:"9px 18px",fontSize:13},lg:{padding:"13px 28px",fontSize:14}};
  const st=s[variant]||s.primary;
  const ss=sz[size]||sz.md;
  return(
    <button onClick={onClick} disabled={disabled} style={{
      background:disabled?"var(--brd)":st.bg,
      color:disabled?"var(--txt3)":st.color,
      border:disabled?"1px solid transparent":st.border,
      boxShadow:disabled?"none":st.shadow,
      borderRadius:10,fontWeight:600,cursor:disabled?"not-allowed":"pointer",
      width:full?"100%":"auto",opacity:disabled?.5:1,
      transition:"all .18s ease",letterSpacing:".01em",
      ...ss,...style
    }} className="hov" {...p}>{children}</button>
  );
});

const Card = memo(({children,style={},glass,glow,...p}) => (
  <div style={{
    background:glass?"var(--glass)":"var(--card)",
    border:"1px solid var(--brd)",borderRadius:16,
    backdropFilter:glass?"blur(20px)":undefined,
    boxShadow:glow?"0 0 30px rgba(124,58,237,.08)":undefined,
    ...style
  }} {...p}>{children}</div>
));

const Input = memo(({label,value,onChange,placeholder,type="text",style={},...p}) => (
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label&&<label style={{fontSize:11,fontWeight:600,color:"var(--txt2)",textTransform:"uppercase",letterSpacing:".07em"}}>{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
      background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:10,
      padding:"10px 14px",color:"var(--txt)",fontSize:13,width:"100%",
      transition:"border-color .2s",...style
    }} {...p}/>
  </div>
));

const Pill = memo(({children,color,bg,style={}}) => (
  <span style={{
    display:"inline-flex",alignItems:"center",padding:"3px 10px",
    borderRadius:99,fontSize:11,fontWeight:600,
    background:bg||"var(--glass2)",color:color||"var(--txt2)",
    letterSpacing:".03em",...style
  }}>{children}</span>
));

const Avatar = memo(({name,size=32,style={}}) => {
  const initials=(name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
  const colors=["#7c3aed","#4f46e5","#06b6d4","#10b981","#f59e0b","#ef4444"];
  const col=colors[initials.charCodeAt(0)%colors.length];
  return(
    <div style={{
      width:size,height:size,borderRadius:"50%",background:col,
      display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:size*.38,color:"#fff",
      flexShrink:0,...style
    }}>{initials}</div>
  );
});

const Spinner = () => (
  <div style={{width:16,height:16,borderRadius:"50%",border:"2px solid var(--brd2)",borderTop:"2px solid var(--acc)",animation:"spin 0.7s linear infinite",display:"inline-block"}}/>
);

const ProgressRing = memo(({value,size=60,stroke=5,color="#7c3aed",bg="var(--brd)"}) => {
  const r=(size-stroke*2)/2, C=2*Math.PI*r;
  return(
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={C} strokeDashoffset={C*(1-Math.min(value,100)/100)}
        strokeLinecap="round" style={{transition:"stroke-dashoffset .6s ease"}}/>
    </svg>
  );
});

const ProgressBar = memo(({value,color="var(--acc)",bg="var(--brd)",height=4,style={}}) => (
  <div style={{background:bg,borderRadius:99,height,overflow:"hidden",...style}}>
    <div style={{height:"100%",width:`${Math.min(value,100)}%`,background:color,borderRadius:99,transition:"width .5s ease"}}/>
  </div>
));

const SectionHead = memo(({title,sub,action}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
    <div>
      <h1 style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:700,color:"var(--txt)",letterSpacing:".04em"}}>{title}</h1>
      {sub&&<p style={{fontSize:13,color:"var(--txt2)",marginTop:4,lineHeight:1.5}}>{sub}</p>}
    </div>
    {action}
  </div>
));

/* ═══════════════════════════════════════════════════════════
   SIGNATURE (SVG elegant)
═══════════════════════════════════════════════════════════ */
const SIG_B64="data:image/png;base64,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";

// Real signature — Aagam Shah. White ink, transparent bg.
// Dots placed precisely after underline terminus (angle -0.40°)
const Signature=memo(({size=180})=>{
  const W=size;
  const H=Math.round(size*0.8135);
  return(
    <img src={SIG_B64} alt="Aagam Shah"
      style={{width:W,height:H,display:"block",
              userSelect:"none",pointerEvents:"none"}}/>
  );
});

/* ═══════════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════════ */
function LoginPage({onLogin}) {
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [target,setTarget]=useState("97");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [showPwd,setShowPwd]=useState(false);
  const [notification,setNotification]=useState("");

  const notify=(msg)=>{setNotification(msg);setTimeout(()=>setNotification(""),3000);};

  // Simple local account store (localStorage-based, email is the key)
  const getAccounts=()=>{try{return JSON.parse(localStorage.getItem("studypod_accounts")||"{}");}catch{return{};}};
  const saveAccount=(email,data)=>{const a=getAccounts();a[email.toLowerCase()]=data;localStorage.setItem("studypod_accounts",JSON.stringify(a));};

  const handleAuth=async()=>{
    setError(""); setLoading(true);
    await new Promise(r=>setTimeout(r,600));
    const e=email.trim().toLowerCase();
    if(!e||!password.trim()){setError("Please fill in all fields.");setLoading(false);return;}
    if(password.length<6){setError("Password must be at least 6 characters.");setLoading(false);return;}

    const isAdmin=e===ADMIN.email.toLowerCase()&&password===ADMIN.password;
    if(isAdmin){onLogin({name:"Aagam Shah",email:e,target:97,isAdmin:true});setLoading(false);return;}

    const accounts=getAccounts();

    if(mode==="login"){
      if(!accounts[e]){setError("Account not found. Please create an account first.");setLoading(false);return;}
      if(accounts[e].password!==password){setError("Incorrect password.");setLoading(false);return;}
      const u=accounts[e];
      onLogin({name:u.name,email:e,target:Number(u.target)||97,isAdmin:false});
    } else {
      // signup
      if(!name.trim()){setError("Please enter your name.");setLoading(false);return;}
      const t=Number(target);
      if(!target||isNaN(t)||t<1||t>100){setError("Enter a valid target score between 1 and 100.");setLoading(false);return;}
      if(accounts[e]){setError("An account with this email already exists. Please sign in.");setLoading(false);return;}
      saveAccount(e,{name:name.trim(),password,target:t});
      onLogin({name:name.trim(),email:e,target:t,isAdmin:false});
    }
    setLoading(false);
  };

  const handleGoogle=async()=>{
    setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    const accounts=getAccounts();
    const e="user@gmail.com";
    if(!accounts[e]) saveAccount(e,{name:"Aagam Shah",password:"google",target:97});
    onLogin({name:accounts[e]?.name||"Aagam Shah",email:e,target:accounts[e]?.target||97,isAdmin:false});
    setLoading(false);
  };

  const handleForgot=()=>{
    if(!email.trim()){setError("Enter your email address first.");return;}
    notify("Password reset link sent to "+email);setMode("login");
  };

  const FEATURES=[
    ["🔁","Spaced Repetition Engine"],["🤖","AI Study Coach"],
    ["📅","Smart Daily Planner"],["🃏","AI Flashcard Generator"],
    ["∑","Formula & Concept Sheets"],["📊","Test Score Analytics"],
    ["🏅","Achievement System"],["⏱","Pomodoro Focus Timer"],
  ];

  return(
    <div style={{display:"flex",height:"100vh",background:"var(--bg)",overflow:"hidden",position:"relative"}}>
      {/* Animated orbs */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"-10%",left:"20%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,.18) 0%,transparent 70%)",animation:"orb1 15s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"-15%",right:"15%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(79,70,229,.15) 0%,transparent 70%)",animation:"orb2 18s ease-in-out infinite"}}/>
        <div style={{position:"absolute",top:"40%",right:"35%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,.1) 0%,transparent 70%)",animation:"orb3 12s ease-in-out infinite"}}/>
      </div>

      {/* LEFT hero */}
      <div style={{flex:"0 0 52%",display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 70px",position:"relative",zIndex:1}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:40}}>
          <img src={LOGO_TY} alt="The Study Pod" style={{width:52,height:52,borderRadius:14,objectFit:"cover"}}/>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:800,color:"var(--txt)",letterSpacing:".07em"}}>The Study Pod</div>
            <div style={{fontSize:11,color:"var(--txt3)",fontStyle:"italic"}}>by Aagam Shah</div>
          </div>
        </div>

        <div style={{marginBottom:42}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.25)",borderRadius:10,padding:"6px 14px",marginBottom:16}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"var(--acc)",boxShadow:"0 0 8px #7c3aed"}}/>
            <span style={{fontSize:11,color:"rgba(180,160,255,.9)",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase"}}>AI-Powered Study Ecosystem</span>
          </div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:56,fontWeight:800,color:"var(--txt)",lineHeight:.95,letterSpacing:".04em",marginBottom:10}}>
            The<br/><span style={{background:"linear-gradient(135deg,#a78bfa,#7c3aed,#4f46e5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Study Pod</span>
          </div>
          <div style={{fontSize:12,color:"var(--txt3)",letterSpacing:".12em",fontStyle:"italic",marginBottom:16}}>by Aagam Shah</div>
          <p style={{fontSize:14,color:"var(--txt2)",lineHeight:1.75,maxWidth:380}}>Your AI-powered CBSE Class 12 exam companion. Built to get you to your target score.</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:44,maxWidth:420}}>
          {FEATURES.map(([ic,l],i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 13px",background:"var(--glass)",border:"1px solid var(--brd)",borderRadius:10}}>
              <span style={{fontSize:14}}>{ic}</span>
              <span style={{fontSize:12,color:"var(--txt2)",fontWeight:500}}>{l}</span>
            </div>
          ))}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <Signature size={130}/>
        </div>
      </div>

      {/* RIGHT auth panel */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40,position:"relative",zIndex:1}}>
        <div style={{
          width:"100%",maxWidth:400,
          background:"rgba(19,19,31,0.88)",backdropFilter:"blur(40px)",
          border:"1px solid var(--brd2)",borderRadius:24,padding:38,
          boxShadow:"0 32px 80px rgba(0,0,0,.5)",position:"relative",
        }} className="si">
          {notification&&<div style={{position:"absolute",top:-44,left:"50%",transform:"translateX(-50%)",background:"var(--grn)",color:"#fff",padding:"8px 18px",borderRadius:8,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{notification}</div>}

          {/* Logo in card */}
          <div style={{textAlign:"center",marginBottom:24}}>
            <img src={LOGO_SM} alt="The Study Pod" style={{width:64,height:64,borderRadius:16,objectFit:"cover",margin:"0 auto 10px"}}/>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:"var(--txt)",lineHeight:1}}>The Study Pod</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.25)",fontStyle:"italic",marginTop:2}}>by Aagam Shah</div>
            <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(124,58,237,.3),transparent)",margin:"14px 0 0"}}/>
          </div>

          <div style={{textAlign:"center",marginBottom:22}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:800,color:"var(--txt)",marginBottom:4}}>
              {mode==="login"?"Welcome back 👋":mode==="signup"?"Create account":"Reset password"}
            </div>
            <div style={{fontSize:12,color:"var(--txt3)"}}>
              {mode==="login"?"Sign in to continue your journey":mode==="signup"?"Start your journey today":"We'll send a reset link"}
            </div>
          </div>

          {mode!=="forgot"&&(
            <>
              <button onClick={handleGoogle} disabled={loading} style={{
                width:"100%",padding:"11px",borderRadius:10,background:"#fff",color:"#374151",
                border:"none",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",
                justifyContent:"center",gap:10,marginBottom:16,cursor:"pointer",
              }}>
                <svg width={17} height={17} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{flex:1,height:1,background:"var(--brd)"}}/>
                <span style={{fontSize:11,color:"var(--txt3)"}}>or with email</span>
                <div style={{flex:1,height:1,background:"var(--brd)"}}/>
              </div>
            </>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {mode==="signup"&&(
              <div>
                <label style={{fontSize:11,fontWeight:600,color:"var(--txt2)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>Your Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Aagam Shah"
                  style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"10px 13px",color:"var(--txt)",fontSize:13}}/>
              </div>
            )}
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"var(--txt2)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com"
                style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"10px 13px",color:"var(--txt)",fontSize:13}}/>
            </div>
            {mode!=="forgot"&&(
              <div>
                <label style={{fontSize:11,fontWeight:600,color:"var(--txt2)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>Password</label>
                <div style={{position:"relative"}}>
                  <input type={showPwd?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&handleAuth()} placeholder="••••••••"
                    style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"10px 40px 10px 13px",color:"var(--txt)",fontSize:13}}/>
                  <button onClick={()=>setShowPwd(p=>!p)} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",color:"var(--txt3)",fontSize:13}}>{showPwd?"🙈":"👁"}</button>
                </div>
              </div>
            )}
            {mode==="signup"&&(
              <div>
                <label style={{fontSize:11,fontWeight:600,color:"var(--txt2)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>Target Score (%)</label>
                <input type="number" min="1" max="100" value={target} onChange={e=>setTarget(e.target.value)} placeholder="e.g. 97"
                  style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"10px 13px",color:"var(--txt)",fontSize:13,fontWeight:700}}/>
                <div style={{fontSize:10,color:"var(--txt3)",marginTop:4}}>Enter any score between 1–100</div>
              </div>
            )}
            {error&&<div style={{fontSize:12,color:"#f87171",background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",borderRadius:8,padding:"8px 12px"}}>{error}</div>}
            <button onClick={mode==="forgot"?handleForgot:handleAuth} disabled={loading} style={{
              width:"100%",padding:"13px",borderRadius:10,border:"none",marginTop:4,
              background:loading?"var(--brd)":"linear-gradient(135deg,#7c3aed,#4f46e5)",
              color:loading?"var(--txt3)":"#fff",fontWeight:700,fontSize:14,cursor:loading?"not-allowed":"pointer",
            }}>
              {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Spinner/>{mode==="login"?"Signing in…":"Creating account…"}</span>
               :mode==="login"?"Sign in →":mode==="signup"?"Create account →":"Send reset link"}
            </button>
          </div>

          <div style={{marginTop:20,textAlign:"center",fontSize:12,color:"var(--txt3)"}}>
            {mode==="login"&&<>
              <span>No account? </span>
              <button onClick={()=>{setMode("signup");setError("");}} style={{background:"none",color:"var(--acc)",fontWeight:600,fontSize:12,border:"none",cursor:"pointer"}}>Sign up free</button>
              <span> · </span>
              <button onClick={()=>{setMode("forgot");setError("");}} style={{background:"none",color:"var(--txt3)",fontSize:12,border:"none",cursor:"pointer"}}>Forgot password?</button>
            </>}
            {mode==="signup"&&<>
              <span>Have an account? </span>
              <button onClick={()=>{setMode("login");setError("");}} style={{background:"none",color:"var(--acc)",fontWeight:600,fontSize:12,border:"none",cursor:"pointer"}}>Sign in</button>
            </>}
            {mode==="forgot"&&<button onClick={()=>{setMode("login");setError("");}} style={{background:"none",color:"var(--acc)",fontWeight:600,fontSize:12,border:"none",cursor:"pointer"}}>← Back to sign in</button>}
          </div>
        </div>
      </div>
    </div>
  );
}


function AdminDashboard({user,onLogout}) {
  const [search,setSearch]=useState("");
  const [users,setUsers]=useState(MOCK_USERS);
  const [activeTab,setActiveTab]=useState("users");
  const [notification,setNotification]=useState("");
  const filtered=useMemo(()=>users.filter(u=>u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase())),[users,search]);
  const totalStudyTime=users.reduce((a,b)=>a+b.studyTime,0);
  const avgScore=Math.round(users.reduce((a,b)=>a+b.score,0)/users.length);
  const activeUsers=users.filter(u=>u.active).length;

  const banUser=id=>{setUsers(p=>p.filter(u=>u.id!==id));setNotification("User removed");setTimeout(()=>setNotification(""),2500);};
  const exportCSV=()=>{
    const csv=["Name,Email,Chapters,Streak,Study Time,Score",...users.map(u=>`${u.name},${u.email},${u.chapters},${u.streak},${u.studyTime},${u.score}`)].join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="studypod_users.csv";a.click();
  };

  const adminNav=[
    {id:"users",label:"Users",icon:"👥"},
    {id:"analytics",label:"Analytics",icon:"📊"},
    {id:"api",label:"API Monitor",icon:"⚙️"},
  ];

  return(
    <div style={{display:"flex",height:"100vh",background:"var(--bg)"}}>
      <GS/>
      {/* Admin sidebar */}
      <div style={{width:220,background:"var(--surf)",borderRight:"1px solid var(--brd)",display:"flex",flexDirection:"column",padding:"24px 14px",gap:3}}>
        <div style={{padding:"4px 10px 20px",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:4}}>
            <img src={LOGO_TY} alt="logo" style={{width:30,height:30,borderRadius:8,objectFit:"cover",flexShrink:0}}/>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:"var(--txt)"}}>Admin Panel</div>
              <div style={{fontSize:9,color:"var(--txt3)",fontStyle:"italic"}}>The Study Pod</div>
            </div>
          </div>
        </div>
        {adminNav.map(n=>(
          <button key={n.id} onClick={()=>setActiveTab(n.id)} style={{
            display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:9,border:"none",
            background:activeTab===n.id?"var(--glass2)":"transparent",
            color:activeTab===n.id?"var(--txt)":"var(--txt2)",
            fontSize:13,fontWeight:activeTab===n.id?600:400,textAlign:"left",width:"100%",
            borderLeft:activeTab===n.id?"2px solid var(--acc)":"2px solid transparent",
          }}>
            <span style={{fontSize:14}}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{marginTop:"auto",padding:"16px 10px 0",borderTop:"1px solid var(--brd)"}}>
          <div style={{fontSize:11,color:"var(--txt3)",marginBottom:10}}>{user.email}</div>
          <Btn variant="ghost" onClick={onLogout} style={{fontSize:12,padding:"6px 12px",width:"100%"}}>← Logout</Btn>
        </div>
      </div>

      {/* Admin content */}
      <div style={{flex:1,overflowY:"auto",padding:"36px 40px"}} className="fi">
        {notification&&(
          <div style={{position:"fixed",top:20,right:20,background:"var(--grn)",color:"#fff",padding:"10px 18px",borderRadius:10,fontSize:13,fontWeight:600,zIndex:999}}>{notification}</div>
        )}

        {activeTab==="users"&&(
          <>
            <SectionHead title="User Management" sub="All registered users and their study progress"/>
            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
              {[
                {label:"Total Users",val:users.length,col:"var(--acc)",icon:"👥"},
                {label:"Active Now",val:activeUsers,col:"var(--grn)",icon:"🟢"},
                {label:"Avg Score",val:avgScore+"%",col:"var(--amb)",icon:"📊"},
                {label:"Total Study Hours",val:Math.round(totalStudyTime/60)+"h",col:"var(--acc3)",icon:"⏱"},
              ].map((s,i)=>(
                <Card key={i} style={{padding:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:18}}>{s.icon}</span>
                    <Pill color={s.col}>LIVE</Pill>
                  </div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:800,color:s.col}}>{s.val}</div>
                  <div style={{fontSize:12,color:"var(--txt2)",marginTop:3}}>{s.label}</div>
                </Card>
              ))}
            </div>
            {/* Controls */}
            <div style={{display:"flex",gap:10,marginBottom:18}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users by name or email…"
                style={{flex:1,background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:10,padding:"9px 14px",color:"var(--txt)",fontSize:13}}/>
              <Btn variant="secondary" onClick={exportCSV}>⬇ Export CSV</Btn>
            </div>
            {/* Table */}
            <Card style={{overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid var(--brd)"}}>
                      {["User","Email","Chapters","Streak","Study","Score","Status","Actions"].map(h=>(
                        <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(u=>(
                      <tr key={u.id} style={{borderBottom:"1px solid var(--brd)",transition:"background .15s"}}
                        onMouseEnter={e=>e.currentTarget.style.background="var(--glass)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"12px 16px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:9}}>
                            <Avatar name={u.name} size={28}/>
                            <div>
                              <div style={{fontSize:13,fontWeight:600,color:"var(--txt)"}}>{u.name}</div>
                              <div style={{fontSize:10,color:"var(--txt3)"}}>{u.lastActive}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:"12px 16px",fontSize:12,color:"var(--txt2)"}}>{u.email}</td>
                        <td style={{padding:"12px 16px",fontSize:13,fontWeight:600,color:"var(--txt)"}}>{u.chapters}</td>
                        <td style={{padding:"12px 16px"}}><Pill color="var(--amb)">🔥 {u.streak}d</Pill></td>
                        <td style={{padding:"12px 16px",fontSize:12,color:"var(--txt2)"}}>{u.studyTime}m</td>
                        <td style={{padding:"12px 16px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:7}}>
                            <ProgressBar value={u.score} color={u.score>=90?"var(--grn)":"var(--amb)"} style={{width:60}}/>
                            <span style={{fontSize:12,fontWeight:700,color:u.score>=90?"var(--grn)":"var(--amb)"}}>{u.score}%</span>
                          </div>
                        </td>
                        <td style={{padding:"12px 16px"}}>
                          <Pill color={u.active?"var(--grn)":"var(--txt3)"} bg={u.active?"rgba(16,185,129,.12)":"var(--glass)"}>
                            {u.active?"● Online":"○ Offline"}
                          </Pill>
                        </td>
                        <td style={{padding:"12px 16px"}}>
                          <Btn variant="danger" size="sm" onClick={()=>banUser(u.id)}>Remove</Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {activeTab==="analytics"&&(
          <>
            <SectionHead title="Analytics" sub="Platform-wide performance overview"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              {/* Subject distribution */}
              <Card style={{padding:22}}>
                <div style={{fontWeight:700,marginBottom:16,fontSize:14,color:"var(--txt)"}}>Study Distribution by Subject</div>
                {Object.entries(SUBJECTS).map(([k,s],si)=>{
                  const v=[67,82,74,58,71][si]||65;
                  return(
                    <div key={k} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:12,color:"var(--txt2)"}}>{s.icon} {s.name}</span>
                        <span style={{fontSize:12,fontWeight:600,color:"var(--txt)"}}>{v}%</span>
                      </div>
                      <ProgressBar value={v} color={s.accent}/>
                    </div>
                  );
                })}
              </Card>
              {/* Score distribution */}
              <Card style={{padding:22}}>
                <div style={{fontWeight:700,marginBottom:16,fontSize:14,color:"var(--txt)"}}>Score Ranges</div>
                {[["90–100%",2,"var(--grn)"],["80–89%",2,"var(--acc)"],["70–79%",1,"var(--amb)"],["Below 70%",1,"var(--ros)"]].map(([l,c,col])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:"var(--txt2)",marginBottom:4}}>{l}</div>
                      <ProgressBar value={c/users.length*100} color={col}/>
                    </div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:col,minWidth:24,textAlign:"right"}}>{c}</div>
                  </div>
                ))}
              </Card>
              {/* Engagement */}
              <Card style={{padding:22,gridColumn:"1/-1"}}>
                <div style={{fontWeight:700,marginBottom:16,fontSize:14,color:"var(--txt)"}}>Weekly Activity (Study Sessions)</div>
                <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100}}>
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>{
                    const h=[42,78,55,91,63,38,22][i];
                    return(
                      <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                        <div style={{width:"100%",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",borderRadius:"4px 4px 0 0",height:`${h}%`,transition:"height .5s ease"}}/>
                        <div style={{fontSize:10,color:"var(--txt3)"}}>{d}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </>
        )}

        {activeTab==="api"&&(
          <>
            <SectionHead title="API Monitor" sub="Usage, tokens and cost tracking"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
              {[
                {label:"Total API Calls",val:"2,847",col:"var(--acc)"},
                {label:"Tokens Used",val:"1.2M",col:"var(--acc3)"},
                {label:"Est. Cost",val:"$0.00",col:"var(--grn)"},
              ].map((s,i)=>(
                <Card key={i} style={{padding:18}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:800,color:s.col}}>{s.val}</div>
                  <div style={{fontSize:12,color:"var(--txt2)",marginTop:3}}>{s.label}</div>
                </Card>
              ))}
            </div>
            <Card style={{padding:22}}>
              <div style={{fontWeight:700,marginBottom:16,fontSize:14}}>API Usage Log</div>
              {[...Array(8)].map((_,i)=>{
                const latencyVals=[312,489,201,678,334,521,290,445];
                const tokenVals=[823,1204,567,943,712,1087,634,891];
                return(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--brd)"}}>
                  <span style={{fontSize:12,color:"var(--txt2)",fontFamily:"monospace"}}>POST /v1/messages</span>
                  <div style={{display:"flex",gap:16}}>
                    <span style={{fontSize:12,color:"var(--grn)"}}>200 OK</span>
                    <span style={{fontSize:12,color:"var(--txt3)"}}>{latencyVals[i]}ms</span>
                    <span style={{fontSize:12,color:"var(--acc)"}}>{tokenVals[i]} tokens</span>
                  </div>
                </div>
                );
              })}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════ */
function Sidebar({tab,setTab,user,dueCount,doneCh,totalCh,streak,isDark,setIsDark}) {
  const nav=[
    {id:"dashboard", icon:"⊞", label:"Dashboard"},
    {id:"chapters",  icon:"◫", label:"Chapters"},
    {id:"revision",  icon:"↻", label:"Revision",badge:dueCount},
    {id:"coach",     icon:"✦", label:"AI Coach"},
    {id:"flashcards",icon:"▣", label:"Flashcards"},
    {id:"notes",     icon:"✎", label:"Notes"},
    {id:"quiz",      icon:"◈", label:"AI Quiz"},
    {id:"formula",   icon:"∑", label:"Formula Sheet"},
    {id:"planner",   icon:"▦", label:"Planner"},
    {id:"scores",    icon:"◉", label:"Test Scores"},
    {id:"pomodoro",  icon:"◷", label:"Pomodoro"},
    {id:"badges",    icon:"🏅", label:"Achievements"},
    {id:"pyq",      icon:"📋", label:"PYQ Bank"},
    {id:"profile",   icon:"◎", label:"Profile"},
    {id:"settings",  icon:"◌", label:"Settings"},
  ];
  const progress=pct(doneCh,totalCh);
  return(
    <div style={{
      width:220,background:"var(--surf)",borderRight:"1px solid var(--brd)",
      display:"flex",flexDirection:"column",padding:"20px 12px",
      flexShrink:0,overflowY:"auto",gap:1,
    }}>
      {/* Logo */}
      <div style={{padding:"4px 10px 20px",borderBottom:"1px solid var(--brd)",marginBottom:6}}>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:4}}>
          <img src={LOGO_TY} alt="logo" style={{width:32,height:32,borderRadius:9,objectFit:"cover",flexShrink:0}}/>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:12,fontWeight:700,color:"var(--txt)",letterSpacing:".05em",lineHeight:1.2}}>The Study Pod</div>
            <div style={{fontSize:9,color:"var(--txt3)",fontStyle:"italic",letterSpacing:".05em"}}>by Aagam Shah</div>
          </div>
        </div>
      </div>

      {nav.map(n=>(
        <button key={n.id} onClick={()=>setTab(n.id)} style={{
          display:"flex",alignItems:"center",gap:8,
          padding:"8px 11px",borderRadius:9,border:"none",
          background:tab===n.id?"var(--glass2)":"transparent",
          color:tab===n.id?"var(--txt)":"var(--txt2)",
          fontSize:12,fontWeight:tab===n.id?700:400,
          textAlign:"left",width:"100%",
          borderLeft:tab===n.id?"2px solid var(--acc)":"2px solid transparent",
          transition:"all .15s ease",
        }}>
          <span style={{fontSize:13,minWidth:16,textAlign:"center",fontFamily:"monospace"}}>{n.icon}</span>
          {n.label}
          {(n.badge||0)>0&&<span style={{marginLeft:"auto",background:"rgba(239,68,68,.2)",color:"#ef4444",borderRadius:99,padding:"1px 7px",fontSize:10,fontWeight:700}}>{n.badge}</span>}
        </button>
      ))}

      {/* Bottom */}
      <div style={{marginTop:"auto",padding:"14px 10px 0",borderTop:"1px solid var(--brd)"}}>
        {/* Dark mode toggle */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:11,color:"var(--txt3)"}}>Dark mode</span>
          <button onClick={()=>setIsDark(p=>!p)} style={{
            width:36,height:20,borderRadius:99,border:"none",
            background:isDark?"var(--acc)":"var(--brd2)",
            position:"relative",transition:"background .2s",cursor:"pointer",
          }}>
            <div style={{position:"absolute",top:3,left:isDark?"auto":"3px",right:isDark?"3px":"auto",width:14,height:14,borderRadius:"50%",background:"#fff",transition:"all .2s"}}/>
          </button>
        </div>
        {/* User info */}
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
          <Avatar name={user.name} size={30}/>
          <div style={{minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:"var(--txt)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
            <div style={{fontSize:10,color:"var(--txt3)"}}>🎯 {user.target}% target</div>
          </div>
        </div>
        {/* Progress */}
        <div style={{fontSize:10,color:"var(--txt3)",marginBottom:4,display:"flex",justifyContent:"space-between"}}>
          <span>🔥 {streak}d streak</span><span>{progress}%</span>
        </div>
        <div style={{marginTop:6,fontSize:10,color:"var(--txt3)",display:"flex",justifyContent:"space-between"}}>
          <span>📅 Boards</span>
          <span style={{color:"var(--acc)",fontWeight:700}}>{(()=>{const n=new Date(),d=new Date(n.getFullYear(),1,15);if(d<=n)d.setFullYear(d.getFullYear()+1);return Math.ceil((d-n)/(864e5));})()}d left</span>
        </div>
        <ProgressBar value={progress} color="var(--acc)"/>
        {/* Real Signature */}
        <div style={{marginTop:12,display:"flex",justifyContent:"center"}}>
          <Signature size={110}/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HEATMAP
═══════════════════════════════════════════════════════════ */
const Heatmap = memo(({data}) => {
  const weeks=[];
  for(let i=0;i<52;i++) weeks.push(data.slice(i*7,(i+1)*7));
  const lvl=(c)=>c===0?"var(--glass)":c===1?"#312e81":c===2?"#4c1d95":c===3?"#6d28d9":"#7c3aed";
  return(
    <div style={{overflowX:"auto"}}>
      <div style={{display:"flex",gap:3,alignItems:"flex-start"}}>
        {weeks.map((week,wi)=>(
          <div key={wi} style={{display:"flex",flexDirection:"column",gap:3}}>
            {week.map((day,di)=>(
              <div key={di} title={day.count===0?`${day.date}: No activity`:`${day.date}: ${day.count} study action${day.count>1?"s":""}`} style={{
                width:10,height:10,borderRadius:2,background:lvl(day.count),
                transition:"transform .1s",cursor:"default",
              }}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════ */
function Dashboard({user,chapters,doneCh,totalCh,mastCh,dueRevs,streak,heatmap,activityMap,goals,setGoals,setTab}) {
  const progress=pct(doneCh,totalCh);
  const overdue=dueRevs.filter(c=>c.nextRevision<todayStr());
  const _now=new Date(),_bd=new Date(_now.getFullYear(),1,15);if(_bd<=_now)_bd.setFullYear(_bd.getFullYear()+1);const boardDays=Math.ceil((_bd-_now)/(864e5));
  const [newGoal,setNewGoal]=useState("");
  const quote=useMemo(()=>QUOTES[Math.floor(Math.random()*QUOTES.length)],[]);

  return(
    <div style={{padding:"36px 44px",maxWidth:1100,margin:"0 auto"}} className="fi">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <img src={LOGO_TY} alt="logo" style={{width:42,height:42,borderRadius:11,objectFit:"cover"}}/>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:26,fontWeight:800,color:"var(--txt)",letterSpacing:".03em"}}>
              {greet(user.name)} 👋
            </div>
            <div style={{fontSize:12,color:"var(--txt3)",marginTop:3}}>
              {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
            </div>
          </div>
        </div>
        <div style={{textAlign:"right",padding:"14px 18px",background:"var(--glass)",border:"1px solid var(--brd)",borderRadius:14}}>
          <div style={{fontSize:10,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Board Exam</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,background:"linear-gradient(135deg,#7c3aed,#06b6d4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>{boardDays}</div>
          <div style={{fontSize:10,color:"var(--txt3)",marginTop:2}}>{`days · Feb 15, ${(()=>{const n=new Date(),d=new Date(n.getFullYear(),1,15);if(d<=n)d.setFullYear(d.getFullYear()+1);return d.getFullYear();})()} Boards`}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
        {[
          {label:"Overall Progress",val:`${progress}%`,sub:`${doneCh}/${totalCh} chapters`,col:"var(--acc)",ring:progress},
          {label:"Mastered",val:mastCh,sub:"chapters mastered",col:"var(--grn)",ring:pct(mastCh,totalCh)},
          {label:"Revisions Due",val:dueRevs.length,sub:`${overdue.length} overdue`,col:dueRevs.length>0?"var(--ros)":"var(--acc3)",ring:0},
          {label:"Study Streak",val:`${streak}d`,sub:"keep it going!",col:"var(--amb)",ring:Math.min(streak*3,100)},
        ].map((s,i)=>(
          <Card key={i} className="card-hov" style={{padding:18,cursor:"default"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:28,fontWeight:800,color:s.col,marginBottom:4}}>{s.val}</div>
                <div style={{fontSize:13,fontWeight:600,color:"var(--txt)"}}>{s.label}</div>
                <div style={{fontSize:11,color:"var(--txt3)",marginTop:2}}>{s.sub}</div>
              </div>
              <ProgressRing value={s.ring} size={50} stroke={4} color={s.col}/>
            </div>
          </Card>
        ))}
      </div>

      {/* Motivational quote card with signature */}
      <Card glass style={{padding:"18px 22px",marginBottom:22,display:"flex",alignItems:"center",gap:16}}>
        <div style={{fontSize:20}}>💡</div>
        <div style={{fontSize:13,color:"var(--txt2)",fontStyle:"italic",lineHeight:1.6,flex:1}}>"{quote}"</div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
          <Pill color="var(--acc)">🔥 {streak}d</Pill>
        </div>
      </Card>

      {/* Two columns */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:22}}>
        {/* Subject progress */}
        <Card style={{padding:20}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:16,color:"var(--txt)"}}>Subject Progress</div>
          {Object.entries(SUBJECTS).map(([sub,s])=>{
            const ch=chapters[sub]||[];
            const done=ch.filter(c=>c.status!=="pending").length;
            const tot=ch.length;
            const p2=pct(done,tot);
            const due=ch.filter(c=>c.nextRevision&&c.nextRevision<=todayStr()).length;
            return(
              <div key={sub} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <span style={{fontSize:13}}>{s.icon}</span>
                    <span style={{fontSize:12,color:"var(--txt2)"}}>{s.name}</span>
                    {due>0&&<Pill color="var(--ros)" style={{fontSize:10}}>⚠ {due}</Pill>}
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:s.accent}}>{p2}%</span>
                </div>
                <ProgressBar value={p2} color={s.ring} height={5}/>
              </div>
            );
          })}
        </Card>

        {/* Daily Goals */}
        <Card style={{padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"var(--txt)"}}>🎯 Daily Goals</div>
            <Pill color="var(--grn)">{goals.filter(g=>g.done).length}/{goals.length} done</Pill>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
            {goals.map((g,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:g.done?"var(--glass)":"transparent",borderRadius:9,border:"1px solid var(--brd)"}}>
                <button onClick={()=>setGoals(prev=>prev.map((x,j)=>j===i?{...x,done:!x.done}:x))} style={{
                  width:18,height:18,borderRadius:5,border:`2px solid ${g.done?"var(--grn)":"var(--brd2)"}`,
                  background:g.done?"var(--grn)":"transparent",flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10
                }}>{g.done?"✓":""}</button>
                <span style={{fontSize:12,color:g.done?"var(--txt3)":"var(--txt)",textDecoration:g.done?"line-through":"none",flex:1}}>{g.text}</span>
                <button onClick={()=>setGoals(prev=>prev.filter((_,j)=>j!==i))} style={{background:"none",color:"var(--txt3)",fontSize:14,opacity:.5}}>×</button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={newGoal} onChange={e=>setNewGoal(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&newGoal.trim()){setGoals(p=>[...p,{text:newGoal.trim(),done:false}]);setNewGoal("");}}}
              placeholder="Add a goal for today…"
              style={{flex:1,background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"8px 12px",color:"var(--txt)",fontSize:12}}/>
            <Btn size="sm" onClick={()=>{if(newGoal.trim()){setGoals(p=>[...p,{text:newGoal.trim(),done:false}]);setNewGoal("");}}} disabled={!newGoal.trim()}>Add</Btn>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:12,color:"var(--txt)"}}>Quick Actions</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
        {[
          {icon:"📚",label:"Mark Chapters",tab:"chapters"},
          {icon:"🤖",label:"AI Coach",tab:"coach"},
          {icon:"🃏",label:"Flashcards",tab:"flashcards"},
          {icon:"📅",label:"Planner",tab:"planner"},
          {icon:"⏱",label:"Pomodoro",tab:"pomodoro"},
        ].map((a,i)=>(
          <Card key={i} className="card-hov" style={{padding:"16px 12px",textAlign:"center",cursor:"pointer"}} onClick={()=>setTab(a.tab)}>
            <div style={{fontSize:22,marginBottom:7}}>{a.icon}</div>
            <div style={{fontSize:11,fontWeight:600,color:"var(--txt2)"}}>{a.label}</div>
          </Card>
        ))}
      </div>

      {/* Overdue alert */}
      {overdue.length>0&&(
        <Card style={{marginTop:18,padding:18,background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.2)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700,color:"var(--ros)",marginBottom:6}}>⚠️ {overdue.length} Overdue Revisions</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {overdue.slice(0,6).map(c=><Pill key={c.id} color="var(--ros)">{c.name}</Pill>)}
                {overdue.length>6&&<Pill color="var(--txt3)">+{overdue.length-6} more</Pill>}
              </div>
            </div>
            <Btn variant="danger" onClick={()=>setTab("revision")}>Revise Now →</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CHAPTERS
═══════════════════════════════════════════════════════════ */
function ChapterTracker({chapters,onMarkStudied}) {
  const [sub,setSub]=useState("english");
  const [filter,setFilter]=useState("all");
  const s=SUBJECTS[sub];
  const ch=chapters[sub]||[];
  const filtered=filter==="all"?ch:ch.filter(c=>c.status===filter);
  const groups={};
  filtered.forEach(c=>{ if(!groups[c.unit]) groups[c.unit]=[]; groups[c.unit].push(c); });

  return(
    <div style={{padding:"36px 44px",maxWidth:920,margin:"0 auto"}} className="fi">
      <SectionHead title="Chapter Tracker" sub="Mark chapters studied → spaced repetition starts automatically."/>
      {/* Subject tabs */}
      <div style={{display:"flex",gap:7,marginBottom:18,flexWrap:"wrap"}}>
        {Object.entries(SUBJECTS).map(([k,sv])=>{
          const done=chapters[k]?.filter(c=>c.status!=="pending").length||0;
          const tot=chapters[k]?.length||0;
          const active=sub===k;
          return(
            <button key={k} onClick={()=>setSub(k)} style={{
              display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:9,
              border:`1.5px solid ${active?sv.ring:"var(--brd)"}`,
              background:active?"var(--glass2)":"transparent",
              color:active?sv.ring:"var(--txt3)",fontSize:12,fontWeight:active?700:400,
              transition:"all .15s",cursor:"pointer",
            }}>
              {sv.icon} {sv.short} <span style={{fontSize:10,opacity:.6}}>({done}/{tot})</span>
            </button>
          );
        })}
      </div>
      {/* Stats banner */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20,padding:16,background:"var(--glass)",borderRadius:12,border:"1px solid var(--brd)"}}>
        {[
          {label:"Total",val:ch.length},
          {label:"Studied",val:ch.filter(c=>c.status!=="pending").length},
          {label:"Mastered",val:ch.filter(c=>c.status==="mastered").length},
        ].map((x,i)=>(
          <div key={i} style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:800,color:"var(--acc)"}}>{x.val}</div>
            <div style={{fontSize:11,color:"var(--txt3)",marginTop:2}}>{x.label}</div>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div style={{display:"flex",gap:6,marginBottom:20}}>
        {["all","pending","studied","mastered"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"5px 14px",borderRadius:8,fontSize:12,fontWeight:filter===f?700:400,
            border:`1px solid ${filter===f?"var(--acc)":"var(--brd)"}`,
            background:filter===f?"var(--glass2)":"transparent",
            color:filter===f?"var(--acc)":"var(--txt3)",cursor:"pointer",transition:"all .15s",
          }}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
        ))}
        <span style={{marginLeft:"auto",fontSize:11,color:"var(--txt3)"}}>{filtered.length} chapters</span>
      </div>
      {/* Chapters */}
      {Object.entries(groups).map(([unit,unitCh])=>(
        <div key={unit} style={{marginBottom:24}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:9}}>— {unit}</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {unitCh.map(c=>{
              const statusCol={pending:"var(--txt3)",studied:"var(--acc3)",mastered:"var(--grn)"}[c.status];
              return(
                <div key={c.id} className="card-hov" style={{
                  display:"flex",alignItems:"center",justifyContent:"space-between",
                  background:"var(--card)",borderRadius:11,padding:"12px 16px",
                  border:`1px solid ${c.status!=="pending"?"var(--brd2)":"var(--brd)"}`,
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:statusCol,flexShrink:0,boxShadow:c.status!=="pending"?`0 0 6px ${statusCol}`:undefined}}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:500,color:"var(--txt)"}}>{c.name}</div>
                      {c.studiedDate&&(
                        <div style={{fontSize:10,color:"var(--txt3)",marginTop:2,fontFamily:"monospace"}}>
                          Studied {c.studiedDate} · Next: {c.nextRevision||"Mastered ✓"} · Rev {c.revisionIndex}/{INTERVALS.length}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <Pill color={statusCol}>{c.status==="mastered"?"✓ Mastered":c.status==="studied"?"Studied":"Pending"}</Pill>
                    {c.status==="pending"&&<Btn size="sm" onClick={()=>onMarkStudied(sub,c.id)}>Mark Studied</Btn>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {filtered.length===0&&<div style={{textAlign:"center",padding:60,color:"var(--txt3)"}}>No chapters in this filter.</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVISION
═══════════════════════════════════════════════════════════ */
function RevisionEngine({chapters,dueRevs,onMarkRevised}) {
  const [done,setDone]       = useState([]);
  const [filter,setFilter]   = useState("all");   // all | overdue | today | subject
  const [selSub,setSelSub]   = useState("all");
  const [sortBy,setSortBy]   = useState("urgency"); // urgency | subject | revision
  const [search,setSearch]   = useState("");
  const [expanded,setExpanded]= useState(null);
  const [aiTip,setAiTip]     = useState({});
  const [loadingTip,setLoadingTip]=useState(null);

  const allCh   = Object.values(chapters).flat();
  const mastered= allCh.filter(c=>c.status==="mastered").length;
  const studied = allCh.filter(c=>c.status==="studied").length;
  const pending2= allCh.filter(c=>c.status==="pending").length;
  const totalRevsDone = allCh.reduce((a,c)=>a+c.revisionHistory.length,0);

  const overdue = dueRevs.filter(c=>c.nextRevision<todayStr()&&!done.includes(c.id));
  const dueTd   = dueRevs.filter(c=>c.nextRevision===todayStr()&&!done.includes(c.id));
  const upcoming= allCh.filter(c=>{
    if(!c.nextRevision||dueRevs.find(d=>d.id===c.id)) return false;
    const diff=Math.ceil((new Date(c.nextRevision)-new Date())/(864e5));
    return diff>0&&diff<=7;
  }).sort((a,b)=>new Date(a.nextRevision)-new Date(b.nextRevision));

  // Filtered pending list
  let pending = dueRevs.filter(c=>!done.includes(c.id));
  if(filter==="overdue")  pending = pending.filter(c=>c.nextRevision<todayStr());
  if(filter==="today")    pending = pending.filter(c=>c.nextRevision===todayStr());
  if(selSub!=="all")      pending = pending.filter(c=>c.subject===selSub);
  if(search.trim())       pending = pending.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
  if(sortBy==="subject")  pending = [...pending].sort((a,b)=>a.subject.localeCompare(b.subject));
  if(sortBy==="revision") pending = [...pending].sort((a,b)=>a.revisionIndex-b.revisionIndex);
  if(sortBy==="urgency")  pending = [...pending].sort((a,b)=>new Date(a.nextRevision)-new Date(b.nextRevision));

  const handle = c => { setDone(p=>[...p,c.id]); onMarkRevised(c.subject,c.id); setExpanded(null); };
  const revLabel= c => (["1st","2nd","3rd","4th","5th"][c.revisionIndex]||"5th")+" revision";
  const daysOverdue = c => Math.abs(Math.ceil((new Date(c.nextRevision)-new Date())/(864e5)));
  const daysUntil   = c => Math.ceil((new Date(c.nextRevision)-new Date())/(864e5));

  // Progress ring data
  const mastPct = allCh.length>0?Math.round(mastered/allCh.length*100):0;

  // AI quick tip for a chapter
  const getAiTip = async (c) => {
    if(aiTip[c.id]||loadingTip===c.id) return;
    setLoadingTip(c.id);
    const text = await callClaude([{role:"user",content:
      "Give a 2-sentence CBSE revision tip for: "+c.name+" ("+SUBJECTS[c.subject].name+"). Focus on what students commonly forget. Be direct and specific."
    }]);
    setAiTip(p=>({...p,[c.id]:text}));
    setLoadingTip(null);
  };

  // Subject completion for mini bars
  const subStats = Object.entries(SUBJECTS).map(([k,s])=>{
    const ch=chapters[k]||[];
    const m=ch.filter(c=>c.status==="mastered").length;
    const d=ch.filter(c=>c.status==="studied").length;
    const due=ch.filter(c=>c.nextRevision&&c.nextRevision<=todayStr()).length;
    return {key:k,s,total:ch.length,mastered:m,studied:d,due};
  });

  return(
    <div style={{padding:"32px 40px",maxWidth:1060,margin:"0 auto"}} className="fi">

      {/* ── Header ── */}
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:700,color:"var(--txt)",letterSpacing:".04em",marginBottom:4}}>Revision Engine</div>
        <div style={{fontSize:12,color:"var(--txt3)"}}>Spaced repetition · 1 → 3 → 7 → 15 → 30 days · 5 revisions = Mastered</div>
      </div>

      {/* ── Top stats ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:22}}>
        {[
          {label:"Due Now",    val:dueRevs.filter(c=>!done.includes(c.id)).length, col:"var(--ros)", icon:"⚡"},
          {label:"Overdue",    val:overdue.length,   col:"#ef4444",      icon:"⚠"},
          {label:"Done Today", val:done.length,      col:"var(--grn)",   icon:"✓"},
          {label:"Mastered",   val:mastered,         col:"var(--acc)",   icon:"🏆"},
          {label:"Total Revisions Done",val:totalRevsDone,col:"var(--acc3)",icon:"↻"},
        ].map((s,i)=>(
          <Card key={i} style={{padding:"14px 12px",textAlign:"center",
            background:i<2&&s.val>0?"rgba(239,68,68,.04)":"var(--card)",
            border:i<2&&s.val>0?"1px solid rgba(239,68,68,.15)":"1px solid var(--brd)"}}>
            <div style={{fontSize:16,marginBottom:4}}>{s.icon}</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:700,color:s.col}}>{s.val}</div>
            <div style={{fontSize:10,color:"var(--txt3)",marginTop:3,lineHeight:1.3}}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* ── Subject overview mini bars ── */}
      <Card style={{padding:18,marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".09em",marginBottom:12}}>Subject Progress</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12}}>
          {subStats.map(({key,s,total,mastered:m,studied:d,due})=>{
            const mastP=total?Math.round(m/total*100):0;
            const studP=total?Math.round(d/total*100):0;
            return(
              <div key={key}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontSize:12}}>{s.icon}</span>
                  <span style={{fontSize:10,color:"var(--txt3)"}}>{m}/{total}</span>
                </div>
                {/* Stacked bar: mastered (accent) + studied (lighter) */}
                <div style={{height:6,borderRadius:99,background:"var(--brd)",overflow:"hidden",marginBottom:4}}>
                  <div style={{height:"100%",display:"flex"}}>
                    <div style={{width:mastP+"%",background:"var(--acc)",transition:"width .5s"}}/>
                    <div style={{width:studP+"%",background:"var(--acc)44",transition:"width .5s"}}/>
                  </div>
                </div>
                {due>0&&<div style={{fontSize:9,color:"var(--ros)",textAlign:"center"}}>⚠ {due} due</div>}
                <button onClick={()=>setSelSub(selSub===key?"all":key)} style={{
                  width:"100%",marginTop:4,fontSize:9,padding:"2px 0",borderRadius:5,border:"none",
                  background:selSub===key?"var(--acc)":"transparent",
                  color:selSub===key?"#fff":"var(--txt3)",cursor:"pointer",transition:"all .15s"
                }}>{selSub===key?"showing":"filter"}</button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── All clear state ── */}
      {dueRevs.filter(c=>!done.includes(c.id)).length===0?(
        <Card style={{textAlign:"center",padding:44,background:"rgba(16,185,129,.04)",border:"1px solid rgba(16,185,129,.2)",marginBottom:22}}>
          <div style={{fontSize:40,marginBottom:10}}>🎉</div>
          <div style={{fontFamily:"'Cinzel',serif",fontWeight:700,color:"var(--grn)",fontSize:17,letterSpacing:".04em",marginBottom:5}}>All Revisions Clear!</div>
          <div style={{color:"var(--txt3)",fontSize:12,marginTop:4}}>
            {done.length>0?done.length+" completed today — excellent work!":"Study new chapters to build your revision schedule."}
          </div>
          {upcoming.length>0&&<div style={{color:"var(--txt3)",fontSize:11,marginTop:8}}>Next revision in {daysUntil(upcoming[0])} day{daysUntil(upcoming[0])!==1?"s":""}: {upcoming[0].name}</div>}
        </Card>
      ):(
        <>
          {/* ── Filter & search bar ── */}
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{position:"relative",flex:1,minWidth:180}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chapters…"
                style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,
                  padding:"8px 12px 8px 32px",color:"var(--txt)",fontSize:12}}/>
              <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"var(--txt3)"}}>⌕</span>
            </div>
            <div style={{display:"flex",gap:6}}>
              {[["all","All"],["overdue","Overdue"],["today","Today"]].map(([f,l])=>(
                <button key={f} onClick={()=>setFilter(f)} style={{
                  padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:filter===f?600:400,cursor:"pointer",
                  border:`1px solid ${filter===f?"var(--acc)":"var(--brd)"}`,
                  background:filter===f?"rgba(124,58,237,.1)":"transparent",
                  color:filter===f?"var(--acc)":"var(--txt2)",transition:"all .15s"
                }}>{l}</button>
              ))}
            </div>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{
              background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,
              padding:"8px 10px",color:"var(--txt)",fontSize:12,cursor:"pointer"
            }}>
              <option value="urgency">Sort: Urgency</option>
              <option value="subject">Sort: Subject</option>
              <option value="revision">Sort: Revision #</option>
            </select>
            <span style={{fontSize:11,color:"var(--txt3)",marginLeft:4}}>{pending.length} showing</span>
          </div>

          {/* ── Pending list ── */}
          {pending.length===0?(
            <div style={{textAlign:"center",padding:32,color:"var(--txt3)",fontSize:13}}>No revisions match this filter.</div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:24}}>
              {pending.map(c=>{
                const sv=SUBJECTS[c.subject];
                const isOver=c.nextRevision<todayStr();
                const daysAgo=isOver?daysOverdue(c):0;
                const revIdx=c.revisionIndex||0;
                const revPct=Math.round(revIdx/5*100);
                const isExpanded=expanded===c.id;

                return(
                  <div key={c.id} style={{
                    background:isOver?"rgba(239,68,68,.03)":"var(--card)",
                    border:`1px solid ${isOver?"rgba(239,68,68,.18)":isExpanded?"var(--acc)44":"var(--brd)"}`,
                    borderRadius:12,overflow:"hidden",transition:"all .2s",
                  }}>
                    {/* Main row */}
                    <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer"}}
                      onClick={()=>{setExpanded(isExpanded?null:c.id); if(!isExpanded) getAiTip(c);}}>
                      
                      {/* Subject icon */}
                      <div style={{width:38,height:38,borderRadius:10,background:`${sv.ring}18`,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
                        border:`1px solid ${sv.ring}33`,flexShrink:0}}>{sv.icon}</div>

                      {/* Info */}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:"var(--txt)",marginBottom:3,
                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:10,color:"var(--txt3)"}}>{sv.name}</span>
                          <span style={{width:1,height:10,background:"var(--brd)"}}/>
                          <span style={{fontSize:10,color:"var(--txt3)"}}>{revLabel(c)}</span>
                          <span style={{width:1,height:10,background:"var(--brd)"}}/>
                          {isOver
                            ?<span style={{fontSize:10,color:"var(--ros)",fontWeight:600}}>{daysAgo}d overdue</span>
                            :<span style={{fontSize:10,color:"var(--txt3)"}}>due today</span>}
                        </div>
                      </div>

                      {/* Revision progress dots */}
                      <div style={{display:"flex",gap:3,flexShrink:0}}>
                        {[0,1,2,3,4].map(n=>(
                          <div key={n} style={{
                            width:8,height:8,borderRadius:"50%",
                            background:n<revIdx?"var(--acc)":"var(--brd)",
                            transition:"background .3s",
                          }}/>
                        ))}
                      </div>

                      {/* Badges & action */}
                      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                        {isOver&&<Pill color="var(--ros)" style={{fontSize:10}}>Overdue</Pill>}
                        <Pill color={sv.ring} style={{fontSize:10}}>{revIdx}/5</Pill>
                        <button onClick={e=>{e.stopPropagation();handle(c);}} style={{
                          padding:"7px 16px",borderRadius:8,border:"none",cursor:"pointer",
                          background:"rgba(16,185,129,.12)",color:"var(--grn)",fontWeight:700,fontSize:12,
                          transition:"all .15s",
                        }} onMouseEnter={e=>e.currentTarget.style.background="rgba(16,185,129,.22)"}
                           onMouseLeave={e=>e.currentTarget.style.background="rgba(16,185,129,.12)"}>
                          ✓ Done
                        </button>
                        <span style={{fontSize:12,color:"var(--txt3)",transform:isExpanded?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
                      </div>
                    </div>

                    {/* Expanded panel */}
                    {isExpanded&&(
                      <div style={{padding:"12px 16px 16px",borderTop:"1px solid var(--brd)",background:"var(--glass)"}}>
                        {/* Revision journey */}
                        <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:14}}>
                          {[1,3,7,15,30].map((days,n)=>(
                            <div key={n} style={{display:"flex",alignItems:"center",flex:1}}>
                              <div style={{
                                width:28,height:28,borderRadius:"50%",
                                background:n<revIdx?"var(--acc)":"var(--brd)",
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontSize:10,fontWeight:700,color:n<revIdx?"#fff":"var(--txt3)",
                                flexShrink:0,zIndex:1,
                              }}>{n<revIdx?"✓":days+"d"}</div>
                              {n<4&&<div style={{flex:1,height:2,background:n<revIdx-1?"var(--acc)":"var(--brd)"}}/>}
                            </div>
                          ))}
                        </div>
                        {/* History */}
                        {c.revisionHistory&&c.revisionHistory.length>0&&(
                          <div style={{fontSize:10,color:"var(--txt3)",marginBottom:10}}>
                            Revised: {c.revisionHistory.map((d,i)=>(
                              <span key={i} style={{marginLeft:6,background:"var(--glass2)",
                                padding:"1px 7px",borderRadius:4}}>{d}</span>
                            ))}
                          </div>
                        )}
                        {/* AI Tip */}
                        <div style={{background:"rgba(124,58,237,.06)",border:"1px solid rgba(124,58,237,.15)",
                          borderRadius:9,padding:"10px 13px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--acc)",
                            textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>⚡ AI Revision Tip</div>
                          {loadingTip===c.id?(
                            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--txt3)"}}>
                              <div style={{width:12,height:12,borderRadius:"50%",border:"2px solid var(--brd)",
                                borderTop:"2px solid var(--acc)",animation:"spin .7s linear infinite"}}/>
                              Generating tip…
                            </div>
                          ):aiTip[c.id]?(
                            <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.65}}>{aiTip[c.id]}</div>
                          ):(
                            <div style={{fontSize:11,color:"var(--txt3)"}}>Tap the card to load an AI revision tip for this chapter.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Upcoming (next 7 days) ── */}
      {upcoming.length>0&&(
        <div style={{marginTop:8}}>
          <div style={{fontWeight:700,fontSize:12,color:"var(--txt3)",textTransform:"uppercase",
            letterSpacing:".09em",marginBottom:10}}>Coming Up — Next 7 Days</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
            {upcoming.slice(0,8).map(c=>{
              const diff=daysUntil(c);
              const sv=SUBJECTS[c.subject];
              return(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,
                  padding:"10px 13px",background:"var(--glass)",borderRadius:10,border:"1px solid var(--brd)"}}>
                  <span style={{fontSize:15}}>{sv.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,color:"var(--txt)",fontWeight:500,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                    <div style={{fontSize:10,color:"var(--txt3)",marginTop:1}}>{sv.short} · Rev {c.revisionIndex+1}/5</div>
                  </div>
                  <Pill style={{flexShrink:0,fontSize:10}} color={diff<=2?"var(--amb)":"var(--txt3)"}>
                    {diff===1?"Tomorrow":"in "+diff+"d"}
                  </Pill>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   AI COACH
═══════════════════════════════════════════════════════════ */
const COACH_SYS=`You are an expert CBSE Class 12 Commerce tutor targeting 97%+ marks. Subjects: English Core, Accountancy, Business Studies, Economics, Applied Mathematics. For numericals: step-by-step. For theory: clear bullet points. CBSE-exam focused. Concise — max 350 words unless asked.`;
const QUICK_P=["Explain Cash Flow Statement","Key Ratio Analysis formulas","Demand vs Supply Elasticity","Solve a Partnership Admission sum","5 BST questions on Directing","Integration formulas sheet"];

function AICoach() {
  const [msgs,setMsgs]=useState([{role:"assistant",content:"Hey! 👋 I'm your AI Study Coach.\n\nI know your full CBSE Class 12 Commerce syllabus:\n• Step-by-step numerical solutions\n• Theory concept explanations\n• CBSE exam tips & marking schemes\n• Practice questions on demand\n• Formula help\n\nWhat do you need help with?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const ref=useRef(null);
  useEffect(()=>ref.current?.scrollIntoView({behavior:"smooth"}),[msgs]);

  const send=async()=>{
    if(!input.trim()||loading) return;
    const u=input.trim(); setInput("");
    const h=[...msgs,{role:"user",content:u}];
    setMsgs(h); setLoading(true);
    const rep=await callClaude(h.map(m=>({role:m.role,content:m.content})),COACH_SYS);
    setMsgs(p=>[...p,{role:"assistant",content:rep}]);
    setLoading(false);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh"}} className="fi">
      <div style={{padding:"16px 28px 12px",borderBottom:"1px solid var(--brd)",background:"var(--surf)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:"var(--txt)"}}>✦ AI Study Coach</div>
          <div style={{fontSize:11,color:"var(--txt3)",marginTop:1}}>Powered by CLAUDE · CBSE Class 12 specialist</div>
        </div>
<div style={{fontSize:11,color:"var(--txt3)",padding:"5px 10px",background:"var(--glass)",borderRadius:8,border:"1px solid var(--brd2)"}}>✦ Claude AI</div>
      </div>
      <div style={{padding:"8px 28px",borderBottom:"1px solid var(--brd)",display:"flex",gap:6,flexWrap:"wrap"}}>
        {QUICK_P.map((q,i)=>(
          <button key={i} onClick={()=>setInput(q)} style={{padding:"4px 11px",borderRadius:20,border:"1px solid var(--brd)",background:"transparent",color:"var(--txt3)",fontSize:11,cursor:"pointer",transition:"all .15s"}}
            onMouseEnter={e=>{e.target.style.borderColor="var(--acc)";e.target.style.color="var(--acc)"}}
            onMouseLeave={e=>{e.target.style.borderColor="var(--brd)";e.target.style.color="var(--txt3)"}}>{q}</button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"24px 28px",display:"flex",flexDirection:"column",gap:14}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeUp .3s ease both"}}>
            {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,marginRight:10,flexShrink:0,marginTop:4}}>✦</div>}
            <div style={{
              maxWidth:"75%",
              background:m.role==="user"?"linear-gradient(135deg,#7c3aed22,#4f46e522)":"var(--card)",
              border:`1px solid ${m.role==="user"?"rgba(124,58,237,.3)":"var(--brd)"}`,
              borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              padding:"12px 16px",fontSize:13,lineHeight:1.75,color:"var(--txt)",whiteSpace:"pre-wrap",
            }}>
              {m.role==="assistant"&&<div style={{fontSize:9,color:"var(--acc)",marginBottom:5,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em"}}>AI Coach</div>}
              {m.content}
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✦</div>
            <div style={{background:"var(--card)",border:"1px solid var(--brd)",borderRadius:"16px 16px 16px 4px",padding:"14px 18px",display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=><div key={i} className={`d${i+1}`} style={{width:7,height:7,borderRadius:"50%",background:"var(--acc)"}}/>)}
            </div>
          </div>
        )}
        <div ref={ref}/>
      </div>
      <div style={{padding:"12px 28px",borderTop:"1px solid var(--brd)",background:"var(--surf)",display:"flex",gap:10}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder="Ask anything… (Enter to send)"
          style={{flex:1,background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:11,padding:"10px 14px",color:"var(--txt)",fontSize:13,resize:"none",height:44}}/>
        <Btn onClick={send} disabled={loading||!input.trim()} style={{height:44,padding:"0 20px"}}>{loading?"…":"Send →"}</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FLASHCARDS
═══════════════════════════════════════════════════════════ */
function Flashcards({onComplete}) {
  const [sub,setSub]=useState("accounts");
  const [topic,setTopic]=useState("");
  const [cards,setCards]=useState([]);
  const [idx,setIdx]=useState(0);
  const [flipped,setFlipped]=useState(false);
  const [known,setKnown]=useState(new Set());
  const [loading,setLoading]=useState(false);
  const [started,setStarted]=useState(false);
  const sv=SUBJECTS[sub];

  const generate=async()=>{
    if(!topic.trim()) return;
    setLoading(true);setCards([]);setIdx(0);setFlipped(false);setKnown(new Set());setStarted(false);
    const prompt=`Generate exactly 10 CBSE Class 12 flashcards on "${topic}" (${SUBJECTS[sub].name}).
Return ONLY valid JSON array, no markdown:
[{"front":"concise question or term","back":"clear exam-ready answer, include formula/steps if relevant"}]`;
    const text=await callClaude([{role:"user",content:prompt}]);
    const match=text.match(/\[[\s\S]*?\]/);
    if(match){try{setCards(JSON.parse(match[0]));setStarted(true);}catch{}}
    setLoading(false);
  };

  const flip=()=>setFlipped(p=>!p);
  const next=()=>{setFlipped(false);setTimeout(()=>setIdx(p=>Math.min(p+1,cards.length-1)),100);};
  const prev=()=>{setFlipped(false);setTimeout(()=>setIdx(p=>Math.max(p-1,0)),100);};
  const markKnown=()=>{setKnown(p=>new Set([...p,idx]));if(idx<cards.length-1)next();};

  return(
    <div style={{padding:"36px 44px",maxWidth:800,margin:"0 auto"}} className="fi">
      <SectionHead title="AI Flashcards" sub="Generate 10 CBSE-targeted flashcards on any topic instantly."/>
      <Card style={{marginBottom:24}}>
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <select value={sub} onChange={e=>setSub(e.target.value)} style={{background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"9px 12px",color:"var(--txt)",fontSize:12,fontWeight:600}}>
            {Object.entries(SUBJECTS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.name}</option>)}
          </select>
          <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&generate()}
            placeholder="Topic: e.g. Admission of Partner, Demand Elasticity, Matrices…"
            style={{flex:1,background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"9px 12px",color:"var(--txt)",fontSize:12}}/>
        </div>
        <Btn full onClick={generate} disabled={loading||!topic.trim()}>
          {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Spinner/> Generating…</span>:"✨ Generate 10 Flashcards"}
        </Btn>
      </Card>

      {started&&cards.length>0&&(
        <div className="si">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:12,color:"var(--txt3)",fontFamily:"monospace"}}>{idx+1} / {cards.length}</span>
            <div style={{display:"flex",gap:7}}>
              <Pill color="var(--grn)">✓ {known.size}</Pill>
              <Pill color="var(--ros)">✗ {cards.length-known.size}</Pill>
            </div>
          </div>
          <ProgressBar value={(idx+1)/cards.length*100} height={3} style={{marginBottom:20}}/>
          <div onClick={flip} style={{
            background:flipped?"var(--glass2)":"var(--card)",
            border:`1.5px solid ${flipped?"var(--acc)":"var(--brd)"}`,
            borderRadius:18,padding:"44px 32px",minHeight:220,cursor:"pointer",textAlign:"center",
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            transition:"all .25s",marginBottom:16,boxShadow:flipped?"0 0 30px rgba(124,58,237,.15)":undefined,
          }}>
            <div style={{fontSize:10,fontWeight:700,color:flipped?"var(--acc)":"var(--txt3)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:16}}>
              {flipped?"— Answer —":"— Question · tap to flip —"}
            </div>
            <div style={{fontSize:17,lineHeight:1.7,color:"var(--txt)",fontWeight:flipped?400:600}}>{flipped?cards[idx].back:cards[idx].front}</div>
          </div>
          <div style={{display:"flex",gap:9,justifyContent:"center",marginBottom:16}}>
            <Btn variant="secondary" onClick={prev} disabled={idx===0}>← Prev</Btn>
            <Btn variant="danger" onClick={()=>{setKnown(p=>{const x=new Set(p);x.delete(idx);return x;});if(idx<cards.length-1)next();}}>✗ Learning</Btn>
            <Btn variant="success" onClick={markKnown}>✓ Know It</Btn>
            <Btn variant="secondary" onClick={next} disabled={idx===cards.length-1}>Next →</Btn>
          </div>
          {idx===cards.length-1&&(
            <Card style={{textAlign:"center",padding:28}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:800,marginBottom:5}}>🎉 Session Complete!</div>
              <div style={{color:"var(--txt2)",fontSize:13,marginBottom:16}}>Score: {known.size}/{cards.length} ({Math.round(known.size/cards.length*100)}%)</div>
              <Btn onClick={()=>{if(onComplete)onComplete(cards.length);setIdx(0);setFlipped(false);setKnown(new Set());}}>↺ Restart</Btn>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NOTES
═══════════════════════════════════════════════════════════ */
function Notes({notes,setNotes}) {
  const [sub,setSub]=useState("accounts");
  const [chapter,setChapter]=useState(null);
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState("");
  const [aiLoading,setAiLoading]=useState(false);

  const sv=SUBJECTS[sub];
  const chs=SYLLABUS[sub]||[];
  const key=chapter?`${sub}__${chapter}`:null;
  const note=key?notes[key]||"":"";

  const saveNote=()=>{if(key){setNotes(p=>({...p,[key]:draft}));setEditing(false);}};
  const aiSummarise=async()=>{
    if(!chapter) return;
    setAiLoading(true);
    const ch=chs.find(c=>c.id===chapter);
    const prompt=`Create concise, exam-ready study notes for CBSE Class 12 topic: "${ch?.name}" (${sv.name}).
Format: Key Points, Important Definitions, Formulas/Formats (if applicable), CBSE Exam Tips. Neat, organised, under 300 words.`;
    const t=await callClaude([{role:"user",content:prompt}]);
    setNotes(p=>({...p,[key]:t}));
    setDraft(t);
    setAiLoading(false);
  };

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden"}} className="fi">
      {/* Chapter list */}
      <div style={{width:240,background:"var(--surf)",borderRight:"1px solid var(--brd)",display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <div style={{padding:"20px 16px 12px",borderBottom:"1px solid var(--brd)"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,marginBottom:10,color:"var(--txt)"}}>✎ Notes</div>
          <select value={sub} onChange={e=>{setSub(e.target.value);setChapter(null);}} style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:8,padding:"7px 10px",color:"var(--txt)",fontSize:12}}>
            {Object.entries(SUBJECTS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.name}</option>)}
          </select>
        </div>
        <div style={{padding:"8px 10px",flex:1,overflowY:"auto"}}>
          {chs.map(c=>{
            const k=`${sub}__${c.id}`;
            const hasNote=!!notes[k];
            return(
              <button key={c.id} onClick={()=>{setChapter(c.id);setDraft(notes[`${sub}__${c.id}`]||"");setEditing(false);}} style={{
                width:"100%",textAlign:"left",padding:"9px 12px",borderRadius:8,
                background:chapter===c.id?"var(--glass2)":"transparent",
                color:chapter===c.id?"var(--txt)":"var(--txt2)",
                border:"none",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:7,
                borderLeft:chapter===c.id?"2px solid var(--acc)":"2px solid transparent",
              }}>
                <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                {hasNote&&<span style={{width:6,height:6,borderRadius:"50%",background:"var(--acc)",flexShrink:0}}/>}
              </button>
            );
          })}
        </div>
      </div>
      {/* Note editor */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
        {chapter?(()=>{
          const ch=chs.find(c=>c.id===chapter);
          return(
            <div style={{flex:1,display:"flex",flexDirection:"column"}}>
              <div style={{padding:"16px 28px",borderBottom:"1px solid var(--brd)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:"var(--txt)"}}>{ch?.name}</div>
                  <div style={{fontSize:11,color:"var(--txt3)",marginTop:2}}>{sv.name} · {ch?.unit}</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn variant="secondary" size="sm" onClick={aiSummarise} disabled={aiLoading}>
                    {aiLoading?<><Spinner/> Generating…</>:"✦ AI Generate Notes"}
                  </Btn>
                  {!editing?<Btn size="sm" onClick={()=>{setDraft(note);setEditing(true);}}>✎ Edit</Btn>
                   :<><Btn size="sm" onClick={saveNote}>Save</Btn><Btn variant="ghost" size="sm" onClick={()=>setEditing(false)}>Cancel</Btn></>}
                </div>
              </div>
              <div style={{flex:1,padding:"28px"}}>
                {editing?(
                  <textarea value={draft} onChange={e=>setDraft(e.target.value)} style={{
                    width:"100%",minHeight:500,background:"var(--glass)",border:"1px solid var(--brd2)",
                    borderRadius:12,padding:"16px",color:"var(--txt)",fontSize:13,lineHeight:1.8,resize:"vertical"
                  }}/>
                ):note?(
                  <div style={{fontSize:13,lineHeight:1.9,color:"var(--txt)",whiteSpace:"pre-wrap"}}>{note}</div>
                ):(
                  <div style={{textAlign:"center",padding:60,color:"var(--txt3)"}}>
                    <div style={{fontSize:32,marginBottom:12}}>✎</div>
                    <div style={{fontWeight:600,marginBottom:6}}>No notes yet</div>
                    <div style={{fontSize:12,marginBottom:20}}>Click Edit to write your own notes, or let AI generate them.</div>
                    <Btn onClick={aiSummarise} disabled={aiLoading}>{aiLoading?"Generating…":"✦ Generate AI Notes"}</Btn>
                  </div>
                )}
              </div>
            </div>
          );
        })():(
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,color:"var(--txt3)"}}>
            <div style={{fontSize:40}}>✎</div>
            <div style={{fontSize:14,fontWeight:600}}>Select a chapter to view or create notes</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   QUIZ GENERATOR
═══════════════════════════════════════════════════════════ */
function QuizGen({onPerfect}) {
  const [sub,setSub]=useState("accounts");
  const [topic,setTopic]=useState("");
  const [qs,setQs]=useState([]);
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [loading,setLoading]=useState(false);

  const generate=async()=>{
    if(!topic.trim()) return;
    setLoading(true);setQs([]);setAnswers({});setSubmitted(false);
    const prompt=`Generate 8 multiple-choice questions for CBSE Class 12 exam on "${topic}" (${SUBJECTS[sub].name}).
Return ONLY valid JSON array:
[{"q":"question text","opts":["A. option","B. option","C. option","D. option"],"ans":"A","exp":"brief explanation"}]
Make questions exam-standard, clear options, one correct answer.`;
    const text=await callClaude([{role:"user",content:prompt}]);
    const match=text.match(/\[[\s\S]*?\]/);
    if(match){try{setQs(JSON.parse(match[0]));}catch{}}
    setLoading(false);
  };

  const score=qs.filter((q,i)=>answers[i]===q.ans).length;
  const handleSubmit=()=>{setSubmitted(true);if(score===qs.length&&qs.length>0&&onPerfect)onPerfect();};

  return(
    <div style={{padding:"36px 44px",maxWidth:860,margin:"0 auto"}} className="fi">
      <SectionHead title="◈ AI Quiz Generator" sub="Generate 8 CBSE-standard MCQs on any topic. Check your understanding."/>
      <Card style={{marginBottom:24}}>
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <select value={sub} onChange={e=>setSub(e.target.value)} style={{background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"9px 12px",color:"var(--txt)",fontSize:12}}>
            {Object.entries(SUBJECTS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.name}</option>)}
          </select>
          <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&generate()}
            placeholder="Topic: e.g. Partnership Admission, Market Equilibrium, Integration…"
            style={{flex:1,background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"9px 12px",color:"var(--txt)",fontSize:12}}/>
        </div>
        <Btn full onClick={generate} disabled={loading||!topic.trim()}>
          {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Spinner/> Generating 8 MCQs…</span>:"🎯 Generate Quiz"}
        </Btn>
      </Card>

      {qs.length>0&&(
        <div className="si">
          {submitted&&(
            <Card style={{marginBottom:24,padding:20,background:score/qs.length>=.75?"rgba(16,185,129,.08)":"rgba(239,68,68,.06)",border:`1px solid ${score/qs.length>=.75?"rgba(16,185,129,.2)":"rgba(239,68,68,.2)"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:4,color:score/qs.length>=.75?"var(--grn)":"var(--ros)"}}>{score}/{qs.length} Correct ({Math.round(score/qs.length*100)}%)</div>
                  <div style={{fontSize:12,color:"var(--txt2)"}}>
                    {score/qs.length>=.9?"Excellent! You've mastered this topic.":score/qs.length>=.7?"Good work! Review the ones you missed.":"Keep practicing — revisit this topic."}
                  </div>
                </div>
              </div>
            </Card>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {qs.map((q,qi)=>(
              <Card key={qi} style={{padding:20}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--txt)",marginBottom:14,lineHeight:1.6}}>
                  <span style={{color:"var(--acc)",marginRight:8}}>Q{qi+1}.</span>{q.q}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {(q.opts||[]).map((opt,oi)=>{
                    const letter=["A","B","C","D"][oi];
                    const selected=answers[qi]===letter;
                    const isCorrect=submitted&&letter===q.ans;
                    const isWrong=submitted&&selected&&letter!==q.ans;
                    return(
                      <button key={oi} onClick={()=>!submitted&&setAnswers(p=>({...p,[qi]:letter}))} style={{
                        textAlign:"left",padding:"10px 14px",borderRadius:9,fontSize:12,
                        border:`1px solid ${isCorrect?"var(--grn)":isWrong?"var(--ros)":selected?"var(--acc)":"var(--brd)"}`,
                        background:isCorrect?"rgba(16,185,129,.1)":isWrong?"rgba(239,68,68,.08)":selected?"rgba(124,58,237,.1)":"var(--glass)",
                        color:isCorrect?"var(--grn)":isWrong?"var(--ros)":selected?"var(--acc)":"var(--txt2)",
                        cursor:submitted?"default":"pointer",fontWeight:selected||isCorrect?600:400,
                        transition:"all .15s",
                      }}>
                        <span style={{marginRight:8,fontWeight:700}}>{letter}.</span>{opt.replace(/^[ABCD]\.\s*/,"")}
                      </button>
                    );
                  })}
                </div>
                {submitted&&<div style={{marginTop:10,fontSize:12,color:"var(--txt3)",lineHeight:1.6,background:"var(--glass)",borderRadius:8,padding:"8px 12px"}}>💡 {q.exp}</div>}
              </Card>
            ))}
          </div>
          {!submitted?(
            <Btn full style={{marginTop:20}} onClick={handleSubmit} disabled={Object.keys(answers).length<qs.length}>
              Submit Quiz ({Object.keys(answers).length}/{qs.length} answered)
            </Btn>
          ):(
            <Btn full variant="secondary" style={{marginTop:20}} onClick={()=>{setQs([]);setAnswers({});setSubmitted(false);}}>Generate Another Quiz</Btn>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FORMULA SHEET
═══════════════════════════════════════════════════════════ */
function FormulaSheet() {
  const [sub,setSub]=useState("accounts");
  const [topic,setTopic]=useState("");
  const [sheet,setSheet]=useState("");
  const [loading,setLoading]=useState(false);
  const sv=SUBJECTS[sub];
  const quickTopics={
    english:["Writing Formats","Flamingo Themes","Grammar Rules","Poetry Analysis"],
    accounts:["Ratio Analysis","Partnership Formulas","Cash Flow Format","Company Accounts"],
    bst:["Management Functions","Marketing Mix","Financial Markets","Consumer Protection"],
    economics:["Elasticity Formulas","National Income","Money Supply","Market Equilibrium"],
    maths:["Integration Formulas","Matrix Operations","Statistics","LPP Method"],
  };

  const generate=async()=>{
    setLoading(true);setSheet("");
    const prompt=`Comprehensive formula and concept sheet for CBSE Class 12 ${SUBJECTS[sub].name}${topic?` — "${topic}"`:" (complete overview)"}.

Sections (use these exact headers):
📌 KEY FORMULAS
📖 IMPORTANT DEFINITIONS  
⭐ EXAM TIPS
⚠️ COMMON MISTAKES TO AVOID

Plain text. Concise. Exam-ready.`;
    const r=await callClaude([{role:"user",content:prompt}]);
    setSheet(r);
    setLoading(false);
  };

  return(
    <div style={{padding:"36px 44px",maxWidth:860,margin:"0 auto"}} className="fi">
      <SectionHead title="∑ Formula & Concept Sheet" sub="AI-generated exam-ready revision sheets for any topic."/>
      <Card style={{marginBottom:24}}>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          <select value={sub} onChange={e=>setSub(e.target.value)} style={{background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"9px 12px",color:"var(--txt)",fontSize:12}}>
            {Object.entries(SUBJECTS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.name}</option>)}
          </select>
          <input value={topic} onChange={e=>setTopic(e.target.value)} onKeyDown={e=>e.key==="Enter"&&generate()}
            placeholder="Topic (optional) — leave blank for full subject sheet"
            style={{flex:1,background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"9px 12px",color:"var(--txt)",fontSize:12}}/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {(quickTopics[sub]||[]).map(t=>(
            <button key={t} onClick={()=>setTopic(t)} style={{padding:"4px 12px",borderRadius:7,fontSize:11,border:"1px solid var(--brd)",background:"var(--glass)",color:"var(--txt3)",cursor:"pointer",transition:"all .15s"}}
              onMouseEnter={e=>{e.target.style.borderColor="var(--acc)";e.target.style.color="var(--acc)"}}
              onMouseLeave={e=>{e.target.style.borderColor="var(--brd)";e.target.style.color="var(--txt3)"}}>{t}</button>
          ))}
        </div>
        <Btn full onClick={generate} disabled={loading}>
          {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Spinner/> Generating sheet…</span>:"📄 Generate Formula Sheet"}
        </Btn>
      </Card>
      {sheet&&(
        <Card style={{padding:28}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"var(--txt)"}}>{sv.icon} {sv.name}{topic?" — "+topic:""}</div>
            </div>
            <Btn variant="secondary" size="sm" onClick={()=>{const w=window.open("","_blank");const html="<!DOCTYPE html><html><head><style>body{font-family:monospace;padding:40px;max-width:800px;margin:0 auto;white-space:pre-wrap;line-height:1.8;color:#111}</style></head><body>"+sheet.replace(/</g,"&lt;")+"</body></html>";w.document.write(html);w.print();}}>🖨 Print</Btn>
          </div>
          <div style={{whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.9,color:"var(--txt2)"}}>{sheet}</div>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLANNER
═══════════════════════════════════════════════════════════ */
function Planner({chapters,dueRevs,user}) {
  const [hours,setHours]=useState(6);
  const [weakSub,setWeakSub]=useState("accounts");
  const [mode,setMode]=useState("study");
  const [plan,setPlan]=useState("");
  const [loading,setLoading]=useState(false);
  const allCh=Object.values(chapters).flat();
  const pending=allCh.filter(c=>c.status==="pending").length;

  const generate=async()=>{
    setLoading(true);setPlan("");
    const progress=Object.entries(SUBJECTS).map(([k,s])=>{const ch=chapters[k]||[];return `${s.name}: ${ch.filter(c=>c.status!=="pending").length}/${ch.length}`;}).join(", ");
    const prompt=`Build a Pomodoro timetable for ${user.name} (CBSE Class 12 Commerce, target ${user.target}%).

Hours: ${hours}h | Mode: ${mode} | Weakest: ${SUBJECTS[weakSub].name}
Progress: ${progress} | Revisions due: ${dueRevs.length}

Create time-blocked schedule. Use 25min study + 5min break. Include specific chapters/topics per block. Start 6:00 AM. Prioritise weakest subject. End with a motivating quote.`;
    const r=await callClaude([{role:"user",content:prompt}]);
    setPlan(r);setLoading(false);
  };

  return(
    <div style={{padding:"36px 44px",maxWidth:880,margin:"0 auto"}} className="fi">
      <SectionHead title="▦ Smart Planner" sub="AI builds your personalised Pomodoro timetable based on your real progress."/>
      <Card style={{marginBottom:22,padding:24}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18,marginBottom:18}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:"var(--txt3)",marginBottom:9,textTransform:"uppercase",letterSpacing:".07em"}}>Hours Today</div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <input type="range" min={2} max={12} value={hours} onChange={e=>setHours(+e.target.value)} style={{flex:1}}/>
              <span style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:800,color:"var(--acc)",minWidth:34}}>{hours}h</span>
            </div>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:"var(--txt3)",marginBottom:9,textTransform:"uppercase",letterSpacing:".07em"}}>Weakest Subject</div>
            <select value={weakSub} onChange={e=>setWeakSub(e.target.value)} style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"8px 10px",color:"var(--txt)",fontSize:12}}>
              {Object.entries(SUBJECTS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.name}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:"var(--txt3)",marginBottom:9,textTransform:"uppercase",letterSpacing:".07em"}}>Today's Mode</div>
            <select value={mode} onChange={e=>setMode(e.target.value)} style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"8px 10px",color:"var(--txt)",fontSize:12}}>
              <option value="study">📚 New Syllabus</option>
              <option value="revision">🔁 Revision Focus</option>
              <option value="exam">📝 Exam Practice</option>
            </select>
          </div>
        </div>
        <Btn full onClick={generate} disabled={loading} size="lg">
          {loading?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Spinner/> AI crafting your schedule…</span>:"🗓 Generate Today's Timetable"}
        </Btn>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:22}}>
        {[{l:"Chapters Left",v:pending},{l:"Revisions Due",v:dueRevs.length},{l:"Pomodoros",v:Math.floor(hours*60/30)}].map((s,i)=>(
          <Card key={i} style={{padding:14,textAlign:"center"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:800,color:"var(--acc)"}}>{s.v}</div>
            <div style={{fontSize:11,color:"var(--txt3)",marginTop:2}}>{s.l}</div>
          </Card>
        ))}
      </div>
      {plan&&(
        <Card style={{padding:28}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,marginBottom:18,color:"var(--txt)"}}>📋 Today's Schedule</div>
          <div style={{whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.95,color:"var(--txt2)"}}>{plan}</div>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEST SCORES
═══════════════════════════════════════════════════════════ */
function TestScores({user}) {
  const [scores,setScores]=useState([]);
  const [form,setForm]=useState({subject:"accounts",score:"",total:"100",notes:"",date:todayStr()});
  const [adding,setAdding]=useState(false);
  const [analysis,setAnalysis]=useState("");
  const [analysing,setAnalysing]=useState(false);

  const subAvg=sub=>{const s=scores.filter(x=>x.subject===sub);return s.length?Math.round(s.reduce((a,b)=>a+b.pct,0)/s.length):null;};
  const add=()=>{
    if(!form.score||!form.total) return;
    setScores(p=>[{...form,id:Date.now(),pct:Math.round(+form.score/+form.total*100)},...p]);
    setForm({subject:"accounts",score:"",total:"100",notes:"",date:todayStr()});
    setAdding(false);
  };
  const analyse=async()=>{
    setAnalysing(true);setAnalysis("");
    const data=Object.keys(SUBJECTS).map(s=>`${SUBJECTS[s].name}: avg ${subAvg(s)||"N/A"}%`).join(", ");
    const r=await callClaude([{role:"user",content:`CBSE Class 12 student ${user.name} targets ${user.target}%. Scores: ${data}. Identify 2 weakest subjects, specific action plan to reach ${user.target}%, daily time split. Be practical, under 250 words.`}]);
    setAnalysis(r);setAnalysing(false);
  };

  return(
    <div style={{padding:"36px 44px",maxWidth:900,margin:"0 auto"}} className="fi">
      <SectionHead title="◉ Test Score Tracker" sub="Log scores, track progress, get AI-powered improvement plans."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:22}}>
        {Object.entries(SUBJECTS).map(([k,s])=>{
          const avg=subAvg(k);
          const gap=avg?Math.max(0,user.target-avg):null;
          return(
            <Card key={k} style={{padding:14,textAlign:"center"}}>
              <div style={{fontSize:18,marginBottom:6}}>{s.icon}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:800,color:avg?(avg>=user.target?"var(--grn)":"var(--ros)"):"var(--txt3)"}}>{avg!==null?`${avg}%`:"—"}</div>
              <div style={{fontSize:10,color:"var(--txt3)",marginTop:2}}>{s.short}</div>
              {gap>0&&<div style={{fontSize:10,color:"var(--ros)",marginTop:3}}>-{gap}%</div>}
              {avg!==null&&avg>=user.target&&<div style={{fontSize:10,color:"var(--grn)",marginTop:3}}>✓ Target</div>}
            </Card>
          );
        })}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:22}}>
        <Btn onClick={()=>setAdding(p=>!p)} variant={adding?"secondary":"primary"}>{adding?"✕ Cancel":"+ Add Score"}</Btn>
        <Btn onClick={analyse} disabled={analysing||!scores.length} variant="outline">{analysing?<><Spinner/> Analysing…</>:"✦ AI Analysis"}</Btn>
      </div>
      {adding&&(
        <Card style={{marginBottom:20,padding:22}}>
          <div style={{fontWeight:700,marginBottom:14,fontSize:14,color:"var(--txt)"}}>Add Test Score</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:14}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"var(--txt3)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>Subject</label>
              <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"8px 10px",color:"var(--txt)",fontSize:12}}>
                {Object.entries(SUBJECTS).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
            {[["Score","score","87"],["Out of","total","100"],["Date","date",""]].map(([l,f,ph])=>(
              <div key={f}>
                <label style={{fontSize:11,fontWeight:600,color:"var(--txt3)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>{l}</label>
                <input type={f==="date"?"date":"number"} value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} placeholder={ph}
                  style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"8px 10px",color:"var(--txt)",fontSize:12}}/>
              </div>
            ))}
          </div>
          <input value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Notes (optional)"
            style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"8px 12px",color:"var(--txt)",fontSize:12,marginBottom:14}}/>
          <Btn onClick={add} disabled={!form.score}>Save Score</Btn>
        </Card>
      )}
      {analysis&&(
        <Card style={{marginBottom:20,padding:22,background:"var(--glass2)",border:"1px solid var(--brd2)"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:12,color:"var(--acc)"}}>✦ AI Weakness Analysis</div>
          <div style={{whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.8,color:"var(--txt2)"}}>{analysis}</div>
        </Card>
      )}
      {scores.length>0?(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {scores.map(sc=>{
            const sv=SUBJECTS[sc.subject];
            return(
              <div key={sc.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--card)",borderRadius:11,padding:"12px 16px",border:"1px solid var(--brd)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:9,background:"var(--glass)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,border:"1px solid var(--brd)"}}>{sv.icon}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,color:"var(--txt)"}}>{sv.name}</div>
                    <div style={{fontSize:10,color:"var(--txt3)",fontFamily:"monospace"}}>{sc.date}{sc.notes?` · ${sc.notes}`:""}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <ProgressBar value={sc.pct} color={sc.pct>=user.target?"var(--grn)":"var(--ros)"} style={{width:80}}/>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:sc.pct>=user.target?"var(--grn)":"var(--ros)",minWidth:44,textAlign:"right"}}>{sc.pct}%</span>
                  {sc.pct>=user.target?<Pill color="var(--grn)">✓</Pill>:<Pill color="var(--ros)">-{user.target-sc.pct}%</Pill>}
                  <button onClick={()=>setScores(p=>p.filter(x=>x.id!==sc.id))} style={{background:"none",color:"var(--txt3)",fontSize:16}}>×</button>
                </div>
              </div>
            );
          })}
        </div>
      ):(
        <Card style={{textAlign:"center",padding:48}}>
          <div style={{fontSize:32,marginBottom:8}}>📊</div>
          <div style={{fontWeight:600,color:"var(--txt)",marginBottom:5}}>No scores yet</div>
          <div style={{fontSize:12,color:"var(--txt3)"}}>Add your first test score to start tracking progress.</div>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   POMODORO
═══════════════════════════════════════════════════════════ */
function Pomodoro({onSessionEnd,pomodoroSessions,setPomodoroSessions}) {
  const MODES={work:{label:"Focus",mins:25,grad:"linear-gradient(135deg,#7c3aed,#4f46e5)"},brk:{label:"Break",mins:5,grad:"linear-gradient(135deg,#059669,#10b981)"},long:{label:"Long Break",mins:15,grad:"linear-gradient(135deg,#0ea5e9,#06b6d4)"}};
  const [mode,setMode]=useState("work");
  const [left,setLeft]=useState(25*60);
  const [running,setRunning]=useState(false);
  const [sessions,setSessions]=useState(pomodoroSessions||0);
  const [focusMins,setFocusMins]=useState(0);
  const [sub,setSub]=useState("accounts");
  const intRef=useRef(null);

  const handleEnd=useCallback(()=>{
    if(mode==="work"){
      setFocusMins(p=>p+25);
      setSessions(prev=>{const n=prev+1;n%4===0?setMode("long"):setMode("brk");setLeft(n%4===0?15*60:5*60);if(setPomodoroSessions)setPomodoroSessions(n);return n;});
      if(onSessionEnd) onSessionEnd(1); // record on heatmap
    }else{setMode("work");setLeft(25*60);}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[mode,onSessionEnd,setPomodoroSessions]);

  useEffect(()=>{
    if(running){
      intRef.current=setInterval(()=>{
        setLeft(p=>{if(p<=1){clearInterval(intRef.current);setRunning(false);handleEnd();return 0;}return p-1;});
      },1000);
    }else clearInterval(intRef.current);
    return()=>clearInterval(intRef.current);
  },[running,mode,handleEnd]);
  const switchMode=m=>{clearInterval(intRef.current);setRunning(false);setMode(m);setLeft(MODES[m].mins*60);};
  const reset=()=>{clearInterval(intRef.current);setRunning(false);setLeft(MODES[mode].mins*60);};

  const mm=String(Math.floor(left/60)).padStart(2,"0");
  const ss2=String(left%60).padStart(2,"0");
  const C=2*Math.PI*108;
  const progress=1-left/(MODES[mode].mins*60);
  const m=MODES[mode];

  return(
    <div style={{padding:"40px 32px",display:"flex",flexDirection:"column",alignItems:"center",minHeight:"88vh"}} className="fi">
      <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:800,marginBottom:5,color:"var(--txt)"}}>◷ Pomodoro Timer</div>
      <div style={{fontSize:13,color:"var(--txt3)",marginBottom:28}}>25 min focus · 5 min break · 4 sessions = long break</div>
      <select value={sub} onChange={e=>setSub(e.target.value)} style={{background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"9px 18px",color:"var(--txt)",fontSize:13,fontWeight:600,marginBottom:28}}>
        {Object.entries(SUBJECTS).map(([k,v])=><option key={k} value={k}>{v.icon} Studying: {v.name}</option>)}
      </select>
      <div style={{display:"flex",gap:8,marginBottom:40}}>
        {Object.entries(MODES).map(([k,v])=>(
          <button key={k} onClick={()=>switchMode(k)} style={{padding:"7px 18px",borderRadius:20,fontSize:12,fontWeight:mode===k?700:400,border:`1px solid ${mode===k?"rgba(124,58,237,.5)":"var(--brd)"}`,background:mode===k?"var(--glass2)":"transparent",color:mode===k?"var(--txt)":"var(--txt3)",cursor:"pointer",transition:"all .15s"}}>{v.label}</button>
        ))}
      </div>
      {/* Ring */}
      <div style={{position:"relative",width:260,height:260,marginBottom:40}}>
        <svg width={260} height={260} style={{transform:"rotate(-90deg)",filter:running?"drop-shadow(0 0 20px rgba(124,58,237,.4))":undefined,transition:"filter .5s"}}>
          <circle cx={130} cy={130} r={108} fill="none" stroke="var(--brd)" strokeWidth={8}/>
          <defs>
            <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={mode==="work"?"#7c3aed":mode==="brk"?"#059669":"#0ea5e9"}/>
              <stop offset="100%" stopColor={mode==="work"?"#4f46e5":mode==="brk"?"#10b981":"#06b6d4"}/>
            </linearGradient>
          </defs>
          <circle cx={130} cy={130} r={108} fill="none" stroke="url(#rg)" strokeWidth={8}
            strokeDasharray={C} strokeDashoffset={C*(1-progress)}
            strokeLinecap="round" style={{transition:"stroke-dashoffset .5s ease"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:54,fontWeight:700,color:"var(--txt)",letterSpacing:".04em",lineHeight:1}}>{mm}:{ss2}</div>
          <div style={{fontSize:12,color:"var(--txt3)",marginTop:8,textTransform:"uppercase",letterSpacing:".12em"}}>{m.label}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:40}}>
        <button onClick={reset} style={{width:48,height:48,borderRadius:"50%",border:"1px solid var(--brd2)",background:"var(--glass)",color:"var(--txt3)",fontSize:18,cursor:"pointer",transition:"all .2s"}}
          onMouseEnter={e=>{e.target.style.borderColor="var(--acc)";e.target.style.color="var(--acc)"}}
          onMouseLeave={e=>{e.target.style.borderColor="var(--brd2)";e.target.style.color="var(--txt3)"}}>↺</button>
        <button onClick={()=>setRunning(p=>!p)} style={{
          width:76,height:76,borderRadius:"50%",border:"none",
          background:m.grad,color:"#fff",fontSize:26,cursor:"pointer",
          boxShadow:running?"0 0 0 12px rgba(124,58,237,.15)":"0 4px 20px rgba(124,58,237,.3)",
          transition:"all .3s ease",
        }}>{running?"⏸":"▶"}</button>
        <button onClick={handleEnd} style={{width:48,height:48,borderRadius:"50%",border:"1px solid var(--brd2)",background:"var(--glass)",color:"var(--txt3)",fontSize:18,cursor:"pointer"}}
          onMouseEnter={e=>{e.target.style.borderColor="var(--acc)";e.target.style.color="var(--acc)"}}
          onMouseLeave={e=>{e.target.style.borderColor="var(--brd2)";e.target.style.color="var(--txt3)"}}>⏭</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,width:"100%",maxWidth:380}}>
        {[{l:"Sessions",v:sessions,c:"var(--acc)"},{l:"Focus Mins",v:focusMins,c:"var(--grn)"},{l:"Next Break",v:sessions%4===0&&sessions>0?"Long!":4-(sessions%4)+" left",c:"var(--acc3)"}].map((s,i)=>(
          <Card key={i} style={{padding:14,textAlign:"center"}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:10,color:"var(--txt3)",marginTop:3}}>{s.l}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ACHIEVEMENTS
═══════════════════════════════════════════════════════════ */
function AchievementsPage({chapters,streak,scores,pomodoroSessions=0,quizPerfect=false,flashcardCount=0}) {
  const allCh=Object.values(chapters).flat();
  const studied=allCh.filter(c=>c.status!=="pending").length;
  const mastered=allCh.filter(c=>c.status==="mastered").length;
  const revisions=allCh.reduce((a,c)=>a+c.revisionHistory.length,0);
  const maxScore=scores.length?Math.max(...scores.map(s=>s.pct)):0;
  const totalXP=ACHIEVEMENTS.reduce((a,ach)=>a+(isUnlocked(ach.id)?ach.xp:0),0);

  function isUnlocked(id){
    switch(id){
      case"first_chapter": return studied>=1;
      case"streak_7":      return streak>=7;
      case"streak_30":     return streak>=30;
      case"revisions_10":  return revisions>=10;
      case"mastered_5":    return mastered>=5;
      case"score_90":      return maxScore>=90;
      case"flashcards_50": return flashcardCount>=50;
      case"pomodoro_20":   return pomodoroSessions>=20;
      case"all_subjects":  return Object.keys(SUBJECTS).every(s=>chapters[s]?.some(c=>c.status!=="pending"));
      case"quiz_perfect":  return quizPerfect;
      default: return false;
    }
  }

  const unlocked=ACHIEVEMENTS.filter(a=>isUnlocked(a.id));
  const locked=ACHIEVEMENTS.filter(a=>!isUnlocked(a.id));

  return(
    <div style={{padding:"36px 44px",maxWidth:920,margin:"0 auto"}} className="fi">
      <SectionHead title="🏅 Achievements" sub="Unlock badges by studying consistently and hitting milestones."/>
      {/* XP bar */}
      <Card style={{padding:22,marginBottom:28,background:"linear-gradient(135deg,rgba(124,58,237,.12),rgba(79,70,229,.08))",border:"1px solid rgba(124,58,237,.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"var(--acc)"}}>{totalXP} XP</div>
            <div style={{fontSize:12,color:"var(--txt3)"}}>Total experience points earned</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:700,color:"var(--txt)"}}>{unlocked.length}/{ACHIEVEMENTS.length}</div>
              <div style={{fontSize:12,color:"var(--txt3)"}}>Badges unlocked</div>
            </div>
          </div>
        </div>
        <ProgressBar value={pct(unlocked.length,ACHIEVEMENTS.length)} color="var(--acc)" height={8}/>
      </Card>
      {/* Unlocked */}
      {unlocked.length>0&&(
        <>
          <div style={{fontSize:12,fontWeight:700,color:"var(--grn)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>✓ Unlocked ({unlocked.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
            {unlocked.map(a=>(
              <Card key={a.id} className="card-hov" style={{padding:18,background:"rgba(16,185,129,.06)",border:"1px solid rgba(16,185,129,.2)"}}>
                <div style={{fontSize:30,marginBottom:10}}>{a.icon}</div>
                <div style={{fontWeight:700,fontSize:14,color:"var(--txt)",marginBottom:4}}>{a.title}</div>
                <div style={{fontSize:11,color:"var(--txt3)",marginBottom:10,lineHeight:1.5}}>{a.desc}</div>
                <Pill color="var(--grn)">+{a.xp} XP</Pill>
              </Card>
            ))}
          </div>
        </>
      )}
      {/* Locked */}
      <div style={{fontSize:12,fontWeight:700,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>🔒 Locked ({locked.length})</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {locked.map(a=>(
          <Card key={a.id} style={{padding:18,opacity:.55}}>
            <div style={{fontSize:30,marginBottom:10,filter:"grayscale(1)"}}>{a.icon}</div>
            <div style={{fontWeight:700,fontSize:14,color:"var(--txt)",marginBottom:4}}>{a.title}</div>
            <div style={{fontSize:11,color:"var(--txt3)",marginBottom:10,lineHeight:1.5}}>{a.desc}</div>
            <Pill>+{a.xp} XP</Pill>
          </Card>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════════════════════ */
function ProfilePage({user, setUser}) {
  const [name,setName]=useState(user.name||"");
  const [bio,setBio]=useState(user.bio||"");
  const [target,setTarget]=useState(user.target||97);
  const [grade,setGrade]=useState(user.grade||"Class 12");
  const [subjects,setSubjects]=useState(user.preferredSubjects||[]);
  const [saved,setSaved]=useState(false);
  const [avatar,setAvatar]=useState(user.avatar||null);
  const fileRef=useRef(null);

  const handleSave=()=>{
    const updated={...user,name,bio,target:Number(target),grade,preferredSubjects:subjects,avatar};
    // persist to localStorage
    try{
      const sess=JSON.parse(localStorage.getItem("studypod_session")||"{}");
      localStorage.setItem("studypod_session",JSON.stringify({...sess,...updated}));
      const accounts=JSON.parse(localStorage.getItem("studypod_accounts")||"{}");
      if(accounts[user.email]){accounts[user.email]={...accounts[user.email],name,bio,target,grade};localStorage.setItem("studypod_accounts",JSON.stringify(accounts));}
    }catch{}
    setUser(updated);
    setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };

  const handleAvatar=(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    const r=new FileReader();
    r.onload=ev=>setAvatar(ev.target.result);
    r.readAsDataURL(file);
  };

  const toggleSubject=(s)=>setSubjects(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev,s]);

  return(
    <div style={{padding:"36px 44px",maxWidth:720,margin:"0 auto"}} className="fi">
      <SectionHead title="◎ My Profile" sub="Manage your personal details and preferences."/>

      {/* Avatar + Name */}
      <Card style={{padding:28,marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",gap:22,marginBottom:22}}>
          <div style={{position:"relative"}}>
            {avatar
              ?<img src={avatar} alt="avatar" style={{width:80,height:80,borderRadius:"50%",objectFit:"cover",border:"3px solid var(--acc)"}}/>
              :<Avatar name={name||user.name} size={80}/>}
            <button onClick={()=>fileRef.current?.click()} style={{
              position:"absolute",bottom:0,right:0,width:26,height:26,borderRadius:"50%",
              background:"var(--acc)",border:"2px solid var(--surf)",color:"#fff",fontSize:13,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>✎</button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatar}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:800,color:"var(--txt)"}}>{user.name}</div>
            <div style={{fontSize:13,color:"var(--txt3)"}}>{user.email}</div>
            <Pill color="var(--acc)" style={{marginTop:6}}>🎯 Target: {user.target}%</Pill>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Input label="Display Name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/>
          <div>
            <label style={{fontSize:11,fontWeight:600,color:"var(--txt2)",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".07em"}}>Bio / About</label>
            <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="A few words about yourself…"
              style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:10,padding:"10px 14px",color:"var(--txt)",fontSize:13,resize:"vertical",minHeight:80}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"var(--txt2)",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".07em"}}>Target Score (%)</label>
              <input type="number" min="1" max="100" value={target} onChange={e=>setTarget(e.target.value)}
                style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"10px 13px",color:"var(--txt)",fontSize:15,fontWeight:800,textAlign:"center"}}/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"var(--txt2)",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".07em"}}>Class / Grade</label>
              <select value={grade} onChange={e=>setGrade(e.target.value)}
                style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"10px 13px",color:"var(--txt)",fontSize:13}}>
                {["Class 10","Class 11","Class 12","Dropper","Other"].map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Preferred subjects */}
          <div>
            <label style={{fontSize:11,fontWeight:600,color:"var(--txt2)",display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:".07em"}}>Preferred Subjects</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {Object.entries(SUBJECTS).map(([k,s])=>(
                <button key={k} onClick={()=>toggleSubject(k)} style={{
                  padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",
                  border:`1.5px solid ${subjects.includes(k)?s.ring:"var(--brd)"}`,
                  background:subjects.includes(k)?"var(--glass2)":"transparent",
                  color:subjects.includes(k)?s.ring:"var(--txt3)",transition:"all .15s",
                }}>{s.icon} {s.short}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{marginTop:20,display:"flex",gap:10,alignItems:"center"}}>
          <Btn onClick={handleSave}>{saved?"✓ Saved!":"Save Changes"}</Btn>
          {saved&&<span style={{fontSize:12,color:"var(--grn)"}}>Profile updated successfully.</span>}
        </div>
      </Card>

      {/* Stats card */}
      <Card style={{padding:22}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>Account Stats</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[
            {label:"Email",val:user.email,small:true},
            {label:"Target",val:`${user.target}%`},
            {label:"Grade",val:user.grade||"Class 12"},
          ].map((s,i)=>(
            <div key={i} style={{padding:"12px",background:"var(--glass)",borderRadius:10,border:"1px solid var(--brd)"}}>
              <div style={{fontSize:10,color:"var(--txt3)",marginBottom:4,textTransform:"uppercase",letterSpacing:".07em"}}>{s.label}</div>
              <div style={{fontSize:s.small?10:16,fontWeight:700,color:"var(--txt)",wordBreak:"break-all"}}>{s.val}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════════════════════ */
function Settings({user,isDark,setIsDark,onLogout}) {
  const [target,setTarget]=useState(user.target);
  const [saved,setSaved]=useState(false);
  return(
    <div style={{padding:"36px 44px",maxWidth:720,margin:"0 auto"}} className="fi">
      <SectionHead title="◌ Settings" sub="Customise your experience."/>
      {/* Profile */}
      <Card style={{padding:24,marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:16}}>Profile</div>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:18}}>
          <Avatar name={user.name} size={56}/>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:800,color:"var(--txt)"}}>{user.name}</div>
            <div style={{fontSize:13,color:"var(--txt3)"}}>{user.email}</div>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:600,color:"var(--txt3)",marginBottom:8,textTransform:"uppercase",letterSpacing:".07em"}}>Target Score (%)</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <input type="number" min="1" max="100" value={target} onChange={e=>setTarget(Number(e.target.value)||97)}
              style={{flex:1,background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"10px 13px",color:"var(--txt)",fontSize:16,fontWeight:800,textAlign:"center"}}/>
            <span style={{fontSize:13,color:"var(--txt2)",fontWeight:600}}>%</span>
          </div>
          <div style={{fontSize:10,color:"var(--txt3)",marginTop:5}}>Enter any target between 1–100%</div>
        </div>
        <Btn onClick={()=>setSaved(true)} size="sm">{saved?"✓ Saved":"Save Changes"}</Btn>
      </Card>
      {/* Appearance */}
      <Card style={{padding:24,marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:16}}>Appearance</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"var(--txt)"}}>Dark Mode</div>
            <div style={{fontSize:11,color:"var(--txt3)"}}>Toggle between dark and light themes</div>
          </div>
          <button onClick={()=>setIsDark(p=>!p)} style={{
            width:48,height:26,borderRadius:99,border:"none",
            background:isDark?"var(--acc)":"var(--brd2)",
            position:"relative",transition:"background .2s",cursor:"pointer",
          }}>
            <div style={{position:"absolute",top:4,left:isDark?"auto":"4px",right:isDark?"4px":"auto",width:18,height:18,borderRadius:"50%",background:"#fff",transition:"all .2s"}}/>
          </button>
        </div>
      </Card>
      {/* About */}
      <Card style={{padding:24,marginBottom:18,textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:16}}>About</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:800,color:"var(--txt)",marginBottom:3}}>{APP.name}</div>
        <div style={{fontSize:12,color:"var(--txt3)",marginBottom:16}}>{APP.tagline}</div>
        <img src={LOGO_SM} alt="The Study Pod" style={{width:72,height:72,borderRadius:18,objectFit:"cover",margin:"0 auto 12px",display:"block"}}/>
        <div style={{display:"flex",justifyContent:"center",margin:"8px 0 4px"}}>
          <Signature size={160}/>
        </div>
        <div style={{fontSize:13,color:"var(--txt2)",fontWeight:600}}>Aagam Shah</div>
        <div style={{fontSize:11,color:"var(--txt3)",marginTop:4}}>Version 2.0 · CBSE Class 12 Commerce · 2025–26</div>
      </Card>
      <Btn variant="danger" full onClick={onLogout}>Sign Out</Btn>
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════
   PREVIOUS YEAR QUESTIONS DATA (CBSE 2015–2024)
═══════════════════════════════════════════════════════════ */
const PYQ_DATA = {
  accounts: {
    a1:[
      {year:2024,q:"A and B are partners sharing profits in the ratio of 3:2 with capitals of ₹5,00,000 and ₹3,00,000 respectively. Interest on capital is allowed @ 10% p.a. Net profit for the year was ₹60,000. Prepare Profit & Loss Appropriation Account.",marks:4,type:"SA"},
      {year:2023,q:"State the provisions of the Indian Partnership Act, 1932 in the absence of a partnership deed regarding: (a) Profit sharing (b) Interest on capital (c) Interest on drawings (d) Salary to partners.",marks:4,type:"SA"},
      {year:2022,q:"Distinguish between Fixed Capital Method and Fluctuating Capital Method of maintaining partners' capital accounts.",marks:4,type:"SA"},
      {year:2021,q:"What is a Partnership Deed? State any four items usually included in a Partnership Deed.",marks:4,type:"SA"},
      {year:2020,q:"A, B and C are partners in a firm sharing profits in the ratio of 5:3:2. Their fixed capitals were ₹6,00,000, ₹4,00,000 and ₹2,00,000 respectively. Calculate interest on capital @ 6% p.a.",marks:3,type:"SA"},
      {year:2019,q:"What is meant by 'Guarantee of Profit' in partnership? Who can give such guarantee? Give an example.",marks:3,type:"SA"},
      {year:2018,q:"X, Y and Z are partners sharing profits equally. Their fixed capitals are ₹3,00,000, ₹2,00,000 and ₹1,00,000 respectively. Interest on capital is @ 10% p.a. Firm earned profit of ₹30,000 before interest. Prepare Profit & Loss Appropriation Account.",marks:4,type:"SA"},
      {year:2017,q:"What is 'Past Adjustments' in partnership accounts? How are they recorded? Give journal entries.",marks:3,type:"SA"},
      {year:2016,q:"A and B are partners sharing profits in ratio 3:1. C was their manager to whom they paid a salary of ₹20,000 p.a. C is now admitted as a partner for ¼ share. Calculate new profit sharing ratio and sacrificing ratio.",marks:3,type:"SA"},
      {year:2015,q:"Explain the main features of a partnership firm.",marks:4,type:"SA"},
    ],
    a2:[
      {year:2024,q:"The average profits of a firm for the last five years are ₹1,20,000. Capital invested is ₹8,00,000. Normal rate of return is 10%. Calculate goodwill by: (a) Capitalisation of Super Profit Method (b) Super Profit Method (3 years' purchase).",marks:4,type:"SA"},
      {year:2023,q:"A firm earned average net profits of ₹3,60,000 during the last 3 years. Capital employed in the business is ₹20,00,000 and normal rate of return is 15%. Calculate goodwill by capitalisation method.",marks:3,type:"SA"},
      {year:2022,q:"What is meant by 'Hidden Goodwill'? A and B are equal partners. They admit C for 1/4th share. C brings ₹2,00,000 as capital. Total capital of the firm based on C's share should be ₹10,00,000. Calculate hidden goodwill.",marks:3,type:"SA"},
      {year:2021,q:"State any four factors that affect the value of goodwill of a partnership firm.",marks:4,type:"SA"},
      {year:2020,q:"Net profits of a firm for last four years: 2017 – ₹40,000; 2018 – ₹50,000; 2019 – ₹30,000 (includes abnormal gain ₹5,000); 2020 – ₹45,000. Capital employed ₹2,00,000; Normal ROI 10%. Calculate goodwill using Super Profit Method (4 years purchase).",marks:4,type:"SA"},
      {year:2019,q:"Define 'Goodwill'. Explain the circumstances under which valuation of goodwill becomes necessary in a partnership firm.",marks:4,type:"SA"},
      {year:2018,q:"A and B are partners with goodwill of ₹60,000 in the books. They admit C for 1/5 share. Goodwill is valued at ₹1,00,000. C is unable to bring goodwill in cash. Give necessary journal entries.",marks:3,type:"SA"},
      {year:2017,q:"Calculate goodwill by Average Profit Method (3 years' purchase) from the following: Net profits – 2015: ₹50,000; 2016: ₹60,000; 2017: ₹40,000. In 2016 an abnormal loss of ₹5,000 was incurred.",marks:3,type:"SA"},
      {year:2016,q:"Explain the 'Capitalisation Method' of valuing goodwill with an example.",marks:4,type:"SA"},
      {year:2015,q:"What is 'Super Profit'? How is it calculated? State the formula for goodwill under the Super Profit Method.",marks:3,type:"SA"},
    ],
    a3:[
      {year:2024,q:"A, B and C are partners sharing profits in ratio 3:2:1. They decide to share profits equally in future. Calculate sacrificing ratio and gaining ratio. Pass journal entry for adjustment of goodwill of ₹90,000.",marks:4,type:"SA"},
      {year:2023,q:"X, Y and Z are partners sharing profits in ratio 5:4:1. X retires and Y and Z agree to share future profits equally. Calculate gaining ratio and new profit sharing ratio.",marks:3,type:"SA"},
      {year:2022,q:"What is 'Sacrificing Ratio'? A, B, C share profits in 3:2:1. New ratio is decided as 3:3:2. Calculate each partner's sacrifice or gain.",marks:3,type:"SA"},
      {year:2021,q:"P, Q and R are partners in a firm sharing profits in the ratio 4:3:2. They decide to share profits equally in future. Goodwill of the firm is valued at ₹1,08,000. Record necessary journal entries for treatment of goodwill.",marks:4,type:"SA"},
      {year:2020,q:"Distinguish between Sacrificing Ratio and Gaining Ratio.",marks:3,type:"SA"},
      {year:2019,q:"A and B are partners sharing profits in 3:2. They admit C who brings ₹1,00,000 as goodwill for 1/5th share. Old partners share the goodwill in their old ratio. Pass journal entries.",marks:3,type:"SA"},
      {year:2018,q:"L, M and N are equal partners. They admit O for 1/6th share. L and M equally sacrifice their share for O. Calculate the new profit sharing ratio.",marks:2,type:"SA"},
    ],
    a4:[
      {year:2024,q:"A and B are partners sharing profits in 5:3. They admit C for 1/4th share which he gets equally from A and B. C brings ₹2,00,000 as capital and ₹60,000 as his share of goodwill. Capital of A and B after adjustment is ₹4,00,000 and ₹2,40,000 respectively. Show journal entries and capital accounts.",marks:6,type:"LA"},
      {year:2023,q:"What is meant by 'Revaluation of Assets and Liabilities' at the time of admission? Why is it necessary? Pass journal entries for: (a) Increase in value of land by ₹50,000 (b) Provision for bad debts created ₹10,000 (c) Machinery depreciated by ₹20,000.",marks:4,type:"SA"},
      {year:2022,q:"P and Q are partners sharing profits in ratio 2:1. R is admitted for 1/4th share. Goodwill valued at ₹60,000. R brings only half his share of goodwill in cash. Pass entries.",marks:3,type:"SA"},
      {year:2021,q:"Distinguish between 'Sacrificing Ratio' and 'Gaining Ratio'. Calculate new profit sharing ratio when A, B are equal partners and admit C for 1/5th share from A only.",marks:3,type:"SA"},
      {year:2020,q:"On admission of a new partner, accumulated reserves and profits are distributed among old partners. State two reasons and give journal entries.",marks:3,type:"SA"},
      {year:2019,q:"A and B are partners with equal capitals of ₹3,00,000. C is admitted for 1/3rd share. He brings ₹2,00,000 as capital. Calculate goodwill of the firm and pass necessary journal entries.",marks:4,type:"SA"},
      {year:2018,q:"Explain the concept of 'Reconstitution of Partnership Firm' with reference to admission of a new partner.",marks:3,type:"SA"},
    ],
    a5:[
      {year:2024,q:"A, B and C are partners in ratio 3:2:1. C retires. A and B agree to share profits equally. Goodwill of the firm is ₹1,80,000. C's share of goodwill is to be compensated by A and B in gaining ratio. Pass journal entries and show capital accounts.",marks:5,type:"LA"},
      {year:2023,q:"On retirement of a partner, how is the treatment of 'Joint Life Policy' done? Explain with journal entries.",marks:4,type:"SA"},
      {year:2022,q:"X, Y and Z share profits in 4:3:2. Y retires. X and Z decide to share profits in 5:3 in future. Calculate gaining ratio.",marks:2,type:"SA"},
      {year:2021,q:"State the various items that may need adjustment at the time of retirement of a partner.",marks:4,type:"SA"},
      {year:2020,q:"A retires from the firm. His Capital Account after all adjustments shows ₹1,50,000. He is paid ₹50,000 immediately; balance transferred to his Loan Account @ 9% p.a. interest. Give journal entries for first year.",marks:4,type:"SA"},
      {year:2019,q:"Distinguish between Dissolution of Partnership and Dissolution of Firm.",marks:3,type:"SA"},
      {year:2018,q:"P, Q and R are equal partners. P retires. Q and R are to share profits in 3:2 in future. Calculate gaining ratio and new profit sharing ratio.",marks:2,type:"SA"},
    ],
    a7:[
      {year:2024,q:"Pass journal entries for dissolution: (a) A creditor of ₹40,000 was paid ₹35,000 in full settlement. (b) Machinery realised ₹1,80,000 (Book value ₹2,00,000). (c) Unrecorded investment realised ₹15,000. (d) Realisation expenses ₹5,000 paid by a partner.",marks:4,type:"SA"},
      {year:2023,q:"Explain the accounting treatment of the following on dissolution: (a) Goodwill appearing in the books (b) Profit on realisation (c) Dissolution expenses paid by the firm.",marks:3,type:"SA"},
      {year:2022,q:"On dissolution, the Realisation Account shows a loss of ₹30,000 to be borne by A, B and C in ratio 3:2:1. A's capital is ₹40,000 (Cr.), B's capital is ₹20,000 (Cr.), C's capital is ₹5,000 (Dr.). Pass entries to close capital accounts.",marks:4,type:"SA"},
      {year:2021,q:"Under what circumstances can a firm be dissolved without court intervention?",marks:3,type:"SA"},
      {year:2020,q:"How is the 'Realisation Account' prepared at the time of dissolution? Give its proforma.",marks:4,type:"SA"},
      {year:2019,q:"On dissolution, stock of ₹50,000 was taken by Partner A at ₹45,000. Debtors of ₹30,000 realised ₹28,000. Buildings realised ₹2,50,000 (book value ₹2,00,000). Prepare Realisation Account.",marks:4,type:"SA"},
    ],
    a8:[
      {year:2024,q:"A company issued 20,000 shares of ₹10 each at a premium of ₹2 per share payable: on application ₹4 (including ₹1 premium), on allotment ₹5 (including ₹1 premium), on first call ₹3. The issue was fully subscribed. Pass journal entries up to allotment.",marks:4,type:"SA"},
      {year:2023,q:"Distinguish between 'Issue of Shares at Par', 'Issue at Premium', and 'Issue at Discount'. State the conditions for issue at discount.",marks:4,type:"SA"},
      {year:2022,q:"What is meant by 'Over-subscription'? A company invited applications for 10,000 shares but received applications for 15,000 shares. Applications for 2,000 shares are rejected; remaining are allotted on pro-rata basis. Pass journal entries.",marks:5,type:"LA"},
      {year:2021,q:"What is 'Securities Premium Reserve'? State the purposes for which it can be utilised under the Companies Act.",marks:4,type:"SA"},
      {year:2020,q:"A company forfeited 500 shares of ₹10 each (₹7 called up) held by Ramesh for non-payment of allotment money of ₹3 per share. The shares were originally issued at a premium of ₹2 per share. Give journal entry for forfeiture.",marks:3,type:"SA"},
      {year:2019,q:"What is meant by 'Minimum Subscription'? Why is it important?",marks:2,type:"SA"},
      {year:2018,q:"A limited company issued 50,000 shares of ₹10 each at par. The whole amount is payable on application. All shares were subscribed and amount received. Pass journal entries.",marks:3,type:"SA"},
    ],
    a9:[
      {year:2024,q:"A company forfeited 200 shares of ₹10 each (fully called up) on which the holder had paid ₹6 per share. These shares were reissued to Suresh at ₹8 per share fully paid. Give journal entries for forfeiture and reissue. Calculate amount transferred to Capital Reserve.",marks:4,type:"SA"},
      {year:2023,q:"What is meant by 'Forfeiture of Shares'? On what grounds can shares be forfeited?",marks:3,type:"SA"},
      {year:2022,q:"A company forfeited 100 shares of ₹10 each issued at a premium of ₹2 per share. The shareholder had paid only application money of ₹3 per share. These shares were reissued at ₹9 per share fully paid. Give journal entries.",marks:4,type:"SA"},
      {year:2021,q:"Forfeited shares of ₹10 each (₹8 paid) reissued at ₹7 per share. What amount will be transferred to Capital Reserve?",marks:2,type:"SA"},
      {year:2020,q:"What is the minimum price at which forfeited shares can be reissued?",marks:1,type:"VSA"},
      {year:2019,q:"Pass journal entries: 300 shares of ₹10 each (₹6 called up) forfeited for non-payment of ₹4 per share allotment. Later reissued at ₹5 per share.",marks:4,type:"SA"},
    ],
    a13:[
      {year:2024,q:"From the following data calculate: (a) Current Ratio (b) Quick Ratio (c) Debt-Equity Ratio. Current Assets ₹4,50,000; Inventory ₹1,00,000; Prepaid Expenses ₹50,000; Current Liabilities ₹2,00,000; Long-term Debt ₹3,00,000; Shareholders' Funds ₹5,00,000.",marks:4,type:"SA"},
      {year:2023,q:"Calculate Inventory Turnover Ratio from: Opening Inventory ₹60,000; Closing Inventory ₹80,000; Cost of Revenue from Operations ₹3,60,000. What does this ratio indicate?",marks:3,type:"SA"},
      {year:2022,q:"Net Profit before Interest and Tax ₹3,00,000; Interest ₹50,000; Tax Rate 30%. Calculate: (a) Net Profit Ratio (if Revenue = ₹12,00,000) (b) Interest Coverage Ratio.",marks:3,type:"SA"},
      {year:2021,q:"State any four objectives of 'Ratio Analysis'. Also state any two limitations.",marks:4,type:"SA"},
      {year:2020,q:"From the following data calculate Working Capital Turnover Ratio and Proprietary Ratio: Revenue ₹15,00,000; Working Capital ₹3,00,000; Shareholders' Funds ₹8,00,000; Total Assets ₹12,00,000.",marks:3,type:"SA"},
      {year:2019,q:"Gross Profit Ratio of a firm is 25%. Revenue from Operations is ₹20,00,000. Calculate Gross Profit and Cost of Goods Sold.",marks:2,type:"SA"},
      {year:2018,q:"A company's current ratio is 2.5:1 and its quick ratio is 1.5:1. If its current liabilities are ₹1,50,000, find the value of inventory.",marks:2,type:"SA"},
      {year:2017,q:"What is meant by 'Debt-Equity Ratio'? How does it indicate financial risk?",marks:3,type:"SA"},
      {year:2016,q:"Calculate Trade Receivables Turnover Ratio: Net Credit Sales ₹12,00,000; Opening Debtors ₹80,000; Closing Debtors ₹1,20,000; Bills Receivable ₹40,000.",marks:3,type:"SA"},
    ],
    a14:[
      {year:2024,q:"From the following, calculate Cash Flow from Operating Activities: Net Profit ₹2,50,000; Depreciation ₹40,000; Decrease in Debtors ₹30,000; Increase in Creditors ₹20,000; Increase in Inventory ₹50,000; Loss on Sale of Machinery ₹10,000.",marks:4,type:"SA"},
      {year:2023,q:"State whether the following are Operating, Investing or Financing Activities: (a) Purchase of machinery (b) Repayment of long-term loan (c) Cash received from debtors (d) Dividend paid by a non-finance company (e) Interest paid by a non-finance company.",marks:3,type:"SA"},
      {year:2022,q:"What is meant by 'Cash Equivalents'? Give two examples. Also explain the difference between 'Fund Flow' and 'Cash Flow' statement.",marks:3,type:"SA"},
      {year:2021,q:"Prepare Cash Flow from Investing Activities: Purchased machinery ₹3,00,000; Sold old plant for ₹80,000 (book value ₹1,00,000); Received dividend ₹20,000; Purchased investments ₹1,50,000; Interest received ₹15,000.",marks:4,type:"SA"},
      {year:2020,q:"Net profit of a company is ₹5,00,000. Adjustment needed: Depreciation ₹70,000; Increase in stock ₹40,000; Decrease in debtors ₹30,000; Increase in creditors ₹20,000; Income tax paid ₹80,000. Calculate Net Cash from Operating Activities.",marks:4,type:"SA"},
      {year:2019,q:"Prepare Cash Flow from Financing Activities: Issue of shares ₹5,00,000; Repayment of debentures ₹2,00,000; Dividend paid ₹80,000; Interest paid ₹40,000; Proceeds from bank loan ₹1,00,000.",marks:3,type:"SA"},
      {year:2018,q:"Why is Cash Flow Statement useful? State any four objectives of preparing it.",marks:4,type:"SA"},
      {year:2017,q:"Give one example each of cash inflow and cash outflow from: (a) Operating Activities (b) Investing Activities (c) Financing Activities.",marks:3,type:"SA"},
      {year:2016,q:"A company's Net Profit for the year is ₹6,00,000. During the year, machinery costing ₹2,00,000 (accumulated depreciation ₹80,000) was sold for ₹1,50,000. Depreciation charged during the year was ₹1,20,000. How will these items appear in Cash Flow Statement?",marks:4,type:"SA"},
    ],
  },
  bst: {
    b1:[
      {year:2024,q:"Management is regarded as a profession. Do you agree? Give any five reasons in support of your answer.",marks:5,type:"LA"},
      {year:2023,q:"Explain how 'Management is a multi-dimensional concept'. Give three dimensions.",marks:4,type:"SA"},
      {year:2022,q:"'Management is an art as well as a science.' Explain this statement.",marks:5,type:"LA"},
      {year:2021,q:"Define Management. Explain any four characteristics of management.",marks:5,type:"LA"},
      {year:2020,q:"What is meant by 'Coordination'? Explain any four features of coordination.",marks:5,type:"LA"},
      {year:2019,q:"Distinguish between 'Efficiency' and 'Effectiveness' in management with suitable examples.",marks:3,type:"SA"},
      {year:2018,q:"Explain the importance of management with any five points.",marks:5,type:"LA"},
      {year:2017,q:"Management is considered as a Group Activity. Explain this statement.",marks:3,type:"SA"},
      {year:2016,q:"Explain the various levels of management and their functions.",marks:5,type:"LA"},
      {year:2015,q:"Why is coordination called the 'essence of management'? Explain with four reasons.",marks:4,type:"SA"},
    ],
    b2:[
      {year:2024,q:"Compare the contributions of F.W. Taylor and Henri Fayol to the principles of management.",marks:5,type:"LA"},
      {year:2023,q:"Explain the following principles of Fayol with examples: (a) Unity of Command (b) Unity of Direction (c) Scalar Chain.",marks:5,type:"LA"},
      {year:2022,q:"Taylor introduced various techniques of scientific management. Explain any four of them.",marks:4,type:"SA"},
      {year:2021,q:"State any five principles of scientific management given by F.W. Taylor.",marks:5,type:"LA"},
      {year:2020,q:"What is meant by 'Principle of Equity'? How does it help in achieving organisational goals?",marks:3,type:"SA"},
      {year:2019,q:"'A good manager is one who moulds himself to the requirements of the situation.' Which principle of Fayol is reflected here? Explain with example.",marks:3,type:"SA"},
      {year:2018,q:"Explain the technique of 'Functional Foremanship' introduced by Taylor.",marks:3,type:"SA"},
      {year:2017,q:"State any five differences between principles of management given by Fayol and principles of management given by Taylor.",marks:5,type:"LA"},
    ],
    b4:[
      {year:2024,q:"Explain the steps in the planning process.",marks:5,type:"LA"},
      {year:2023,q:"State any five limitations of planning.",marks:3,type:"SA"},
      {year:2022,q:"Define 'Strategy'. Distinguish between 'Procedure' and 'Method'.",marks:3,type:"SA"},
      {year:2021,q:"Planning is the primary function of management. State any five points to justify.",marks:5,type:"LA"},
      {year:2020,q:"What are 'Single-use Plans'? Distinguish between Budget and Programme.",marks:3,type:"SA"},
      {year:2019,q:"Explain any five types of plans used in an organisation.",marks:5,type:"LA"},
      {year:2018,q:"'Planning is looking ahead while controlling is looking back.' Comment on this statement.",marks:3,type:"SA"},
      {year:2017,q:"What is 'MBO' (Management by Objectives)? State its advantages.",marks:4,type:"SA"},
    ],
    b5:[
      {year:2024,q:"Differentiate between Formal Organisation and Informal Organisation on any five basis.",marks:5,type:"LA"},
      {year:2023,q:"'Authority flows downward whereas accountability flows upward.' Discuss the elements of delegation.",marks:4,type:"SA"},
      {year:2022,q:"Explain the importance of decentralisation with five points.",marks:5,type:"LA"},
      {year:2021,q:"What is 'Span of Management'? State the factors determining the span of management.",marks:3,type:"SA"},
      {year:2020,q:"Compare Functional and Divisional organisational structure on any four basis.",marks:4,type:"SA"},
      {year:2019,q:"Explain the steps in the process of organising.",marks:5,type:"LA"},
      {year:2018,q:"What is meant by 'Delegation of Authority'? Explain its elements.",marks:4,type:"SA"},
    ],
    b6:[
      {year:2024,q:"Explain the steps involved in the selection procedure.",marks:5,type:"LA"},
      {year:2023,q:"Distinguish between On-the-job training and Off-the-job training.",marks:4,type:"SA"},
      {year:2022,q:"What is meant by 'Recruitment'? Explain any four internal sources of recruitment.",marks:5,type:"LA"},
      {year:2021,q:"Define 'Staffing'. Explain why staffing is an important function of management.",marks:4,type:"SA"},
      {year:2020,q:"Explain any five external sources of recruitment.",marks:5,type:"LA"},
      {year:2019,q:"What is 'Performance Appraisal'? Why is it important in staffing?",marks:3,type:"SA"},
      {year:2018,q:"Explain any three methods of training used for executive development.",marks:3,type:"SA"},
    ],
    b7:[
      {year:2024,q:"Explain Maslow's hierarchy of needs theory. How is it relevant to motivation at the workplace?",marks:5,type:"LA"},
      {year:2023,q:"Explain any five barriers to effective communication in an organisation.",marks:5,type:"LA"},
      {year:2022,q:"Distinguish between financial and non-financial incentives. Give two examples of each.",marks:4,type:"SA"},
      {year:2021,q:"What is 'Leadership'? Explain the qualities of a good leader.",marks:5,type:"LA"},
      {year:2020,q:"Explain the measures to overcome barriers to communication.",marks:4,type:"SA"},
      {year:2019,q:"Distinguish between 'Formal' and 'Informal' communication with examples.",marks:4,type:"SA"},
      {year:2018,q:"State any four functions of supervision.",marks:3,type:"SA"},
    ],
    b8:[
      {year:2024,q:"Explain the relationship between planning and controlling.",marks:4,type:"SA"},
      {year:2023,q:"State the steps in the process of controlling.",marks:5,type:"LA"},
      {year:2022,q:"What are the requirements of an ideal control system? State any five.",marks:5,type:"LA"},
      {year:2021,q:"'Planning is looking ahead and controlling is looking back.' Explain this statement.",marks:3,type:"SA"},
      {year:2020,q:"What is 'Management by Exception'? How is it practised in controlling?",marks:3,type:"SA"},
      {year:2019,q:"Explain the importance of controlling in management.",marks:4,type:"SA"},
    ],
    b9:[
      {year:2024,q:"Explain the factors affecting the requirement of working capital in a business.",marks:5,type:"LA"},
      {year:2023,q:"Distinguish between Fixed Capital and Working Capital. What are the factors affecting fixed capital requirements?",marks:5,type:"LA"},
      {year:2022,q:"What is meant by 'Financial Planning'? State its objectives.",marks:4,type:"SA"},
      {year:2021,q:"Explain the factors affecting the choice of capital structure of a company.",marks:5,type:"LA"},
      {year:2020,q:"What is 'Trading on Equity'? Under what circumstances is it favourable?",marks:3,type:"SA"},
      {year:2019,q:"What is meant by 'Capital Structure'? Distinguish between equity capital and preference capital.",marks:4,type:"SA"},
    ],
    b11:[
      {year:2024,q:"Explain the components of the Marketing Mix with examples.",marks:5,type:"LA"},
      {year:2023,q:"What is meant by 'Branding'? State any five advantages of branding for consumers.",marks:5,type:"LA"},
      {year:2022,q:"Distinguish between 'Marketing' and 'Selling' on any five basis.",marks:5,type:"LA"},
      {year:2021,q:"Explain any five factors affecting the choice of channels of distribution.",marks:5,type:"LA"},
      {year:2020,q:"What is 'Advertising'? State any four merits and any two demerits of advertising.",marks:5,type:"LA"},
      {year:2019,q:"Distinguish between 'Advertising' and 'Personal Selling'.",marks:4,type:"SA"},
      {year:2018,q:"What is 'Product Mix'? Explain any four elements of the product mix.",marks:4,type:"SA"},
    ],
    b12:[
      {year:2024,q:"Explain the rights of consumers under the Consumer Protection Act, 2019.",marks:5,type:"LA"},
      {year:2023,q:"Explain the three-tier consumer dispute redressal machinery under the Consumer Protection Act.",marks:5,type:"LA"},
      {year:2022,q:"What is 'Consumer Exploitation'? State any four ways in which consumers are exploited.",marks:4,type:"SA"},
      {year:2021,q:"What are the responsibilities of a consumer? State any five.",marks:3,type:"SA"},
      {year:2020,q:"How can a consumer seek redressal of his grievances? Explain the process.",marks:4,type:"SA"},
      {year:2019,q:"What are the functions of the Consumer Protection Council?",marks:3,type:"SA"},
    ],
  },
  economics: {
    ec2:[
      {year:2024,q:"Explain the law of diminishing marginal utility with a schedule and diagram. State its assumptions.",marks:5,type:"LA"},
      {year:2023,q:"Explain the consumer's equilibrium using Indifference Curve approach. State the conditions.",marks:5,type:"LA"},
      {year:2022,q:"Distinguish between Total Utility and Marginal Utility. Explain the relationship between them.",marks:3,type:"SA"},
      {year:2021,q:"State the properties of Indifference Curves.",marks:4,type:"SA"},
      {year:2020,q:"Explain consumer's equilibrium using the utility analysis (Law of Equi-Marginal Utility).",marks:5,type:"LA"},
    ],
    ec3:[
      {year:2024,q:"Explain the law of demand with a schedule and diagram. State any three exceptions to the law.",marks:5,type:"LA"},
      {year:2023,q:"Distinguish between 'Change in Demand' and 'Change in Quantity Demanded'. Use diagrams.",marks:4,type:"SA"},
      {year:2022,q:"State any five factors that cause a shift in the demand curve.",marks:3,type:"SA"},
      {year:2021,q:"What are 'Substitute Goods'? How does a change in price of a substitute affect demand? Use diagram.",marks:3,type:"SA"},
      {year:2020,q:"What are 'Giffen Goods'? Why does the law of demand not apply to them?",marks:3,type:"SA"},
      {year:2019,q:"Why does the demand curve slope downward from left to right? Give three reasons.",marks:3,type:"SA"},
      {year:2018,q:"What is 'Demand Function'? State the variables in a demand function.",marks:2,type:"SA"},
      {year:2017,q:"Explain the concept of 'Market Demand' and how it is derived.",marks:3,type:"SA"},
    ],
    ec4:[
      {year:2024,q:"What is 'Price Elasticity of Demand'? Calculate PED using % method: Price rises from ₹10 to ₹12, Quantity falls from 500 to 400 units. Comment on the type of elasticity.",marks:4,type:"SA"},
      {year:2023,q:"Explain any four factors that affect the price elasticity of demand.",marks:4,type:"SA"},
      {year:2022,q:"If demand is price inelastic, what will happen to total revenue when price rises? Explain with a diagram.",marks:3,type:"SA"},
      {year:2021,q:"Distinguish between 'Elastic Demand' and 'Inelastic Demand'. Give two examples of each.",marks:4,type:"SA"},
      {year:2020,q:"What is 'Income Elasticity of Demand'? How does it differ for normal goods and inferior goods?",marks:3,type:"SA"},
      {year:2019,q:"If Total Expenditure on a good increases when its price rises, what can you say about its price elasticity?",marks:2,type:"SA"},
    ],
    ec7:[
      {year:2024,q:"Using supply and demand analysis, explain the effect on equilibrium price and quantity when: (a) Both demand and supply increase equally (b) Demand increases but supply decreases.",marks:5,type:"LA"},
      {year:2023,q:"What is 'Equilibrium Price'? How is it determined? Explain with the help of a diagram.",marks:4,type:"SA"},
      {year:2022,q:"What is 'Excess Demand'? How does the market mechanism eliminate it?",marks:3,type:"SA"},
      {year:2021,q:"State the effect of increase in income on equilibrium price and quantity of an inferior good.",marks:3,type:"SA"},
      {year:2020,q:"With the help of a diagram, explain what happens to equilibrium when demand increases but supply remains unchanged.",marks:3,type:"SA"},
    ],
    ec10:[
      {year:2024,q:"Calculate NNPFC (National Income) from the following (₹ crores): GDPMP ₹8,000; Net Factor Income from Abroad (-₹200); Depreciation ₹400; Net Indirect Taxes ₹600.",marks:4,type:"SA"},
      {year:2023,q:"What are the four components of Aggregate Demand in a closed economy? Explain each.",marks:4,type:"SA"},
      {year:2022,q:"Distinguish between GDP and GNP. What is the significance of GDP as a measure of welfare?",marks:4,type:"SA"},
      {year:2021,q:"What are 'Transfer Payments'? Are they included in national income? Give two examples.",marks:3,type:"SA"},
      {year:2020,q:"Calculate Value Added at MP: Output sold 1,000 units @ ₹20; Closing stock 200 units; Opening stock 100 units; Intermediate cost ₹8,000.",marks:3,type:"SA"},
      {year:2019,q:"Explain 'Expenditure Method' of measuring National Income. State its steps.",marks:4,type:"SA"},
      {year:2018,q:"What is 'Double Counting'? How is it avoided while measuring national income?",marks:3,type:"SA"},
      {year:2017,q:"Distinguish between 'Real GDP' and 'Nominal GDP'. Which is a better measure and why?",marks:3,type:"SA"},
    ],
    ec11:[
      {year:2024,q:"Explain the 'Credit Creation' function of commercial banks with an example and diagram.",marks:5,type:"LA"},
      {year:2023,q:"Explain any four instruments of Monetary Policy used by the Central Bank.",marks:4,type:"SA"},
      {year:2022,q:"Distinguish between a Central Bank and a Commercial Bank on any four basis.",marks:4,type:"SA"},
      {year:2021,q:"What is 'Repo Rate'? How does an increase in Repo Rate help in controlling inflation?",marks:3,type:"SA"},
      {year:2020,q:"What is 'Cash Reserve Ratio (CRR)'? How does its increase reduce money supply?",marks:3,type:"SA"},
      {year:2019,q:"Explain the 'Lender of Last Resort' function of the Central Bank.",marks:3,type:"SA"},
      {year:2018,q:"What is 'Open Market Operations'? How does it control credit?",marks:3,type:"SA"},
    ],
    ec12:[
      {year:2024,q:"Distinguish between Revenue Receipts and Capital Receipts in a government budget. Give two examples of each.",marks:4,type:"SA"},
      {year:2023,q:"What is 'Fiscal Deficit'? State its implications. How is it different from 'Revenue Deficit'?",marks:4,type:"SA"},
      {year:2022,q:"Explain any four objectives of Government Budget.",marks:4,type:"SA"},
      {year:2021,q:"What is 'Primary Deficit'? How is it different from Fiscal Deficit? Calculate Primary Deficit from: Fiscal Deficit ₹40,000 crore; Interest Payments ₹15,000 crore.",marks:3,type:"SA"},
      {year:2020,q:"Distinguish between 'Direct Taxes' and 'Indirect Taxes'. Give two examples of each.",marks:3,type:"SA"},
      {year:2019,q:"Explain the concept of 'Deficit Budget'. When does the government go for a deficit budget?",marks:3,type:"SA"},
    ],
    ec13:[
      {year:2024,q:"Explain the components of the Current Account of the Balance of Payments.",marks:4,type:"SA"},
      {year:2023,q:"What is 'Balance of Trade'? How is it different from 'Balance of Payments'?",marks:3,type:"SA"},
      {year:2022,q:"State any four measures to correct a deficit in the Balance of Payments.",marks:4,type:"SA"},
      {year:2021,q:"Distinguish between 'Autonomous' and 'Accommodating' transactions in BOP.",marks:3,type:"SA"},
    ],
    ec14:[
      {year:2024,q:"Explain the 'Flexible Exchange Rate System'. State its merits and demerits.",marks:5,type:"LA"},
      {year:2023,q:"How does depreciation of domestic currency affect exports and imports? Explain.",marks:3,type:"SA"},
      {year:2022,q:"State any four factors that determine the foreign exchange rate.",marks:4,type:"SA"},
      {year:2021,q:"Distinguish between 'Depreciation' and 'Devaluation' of currency.",marks:3,type:"SA"},
    ],
  },
  english: {
    e1:[
      {year:2024,q:"What was the order from Berlin that changed everything in the district of Alsace? What impact did it have on M. Hamel and his students?",marks:5,type:"LA"},
      {year:2023,q:"What transformation did Franz notice in the school on the day of the last lesson?",marks:3,type:"SA"},
      {year:2022,q:"'Language is an expression of our identity.' How does 'The Last Lesson' bring out this theme?",marks:4,type:"SA"},
      {year:2021,q:"Why was Franz afraid of being questioned by M. Hamel? What was his reaction when he heard about the 'last lesson'?",marks:3,type:"SA"},
      {year:2020,q:"The people of Alsace realized the value of their language only when they were about to lose it. Comment.",marks:5,type:"LA"},
      {year:2019,q:"How does M. Hamel conduct himself during the last lesson? What does his behaviour reveal?",marks:4,type:"SA"},
    ],
    e3:[
      {year:2024,q:"How did Douglas overcome his fear of water? What does this episode reveal about his character?",marks:5,type:"LA"},
      {year:2023,q:"Describe the misadventure at the YMCA pool that created a fear of water in Douglas.",marks:4,type:"SA"},
      {year:2022,q:"What strategy did the instructor use to teach Douglas swimming? Was it effective?",marks:4,type:"SA"},
      {year:2021,q:"'All we have to fear is fear itself.' How does the chapter 'Deep Water' illustrate this?",marks:4,type:"SA"},
      {year:2020,q:"What was Douglas's experience at the beach as a child? How did it affect him?",marks:3,type:"SA"},
    ],
    e4:[
      {year:2024,q:"What is the significance of the metaphor of the rattrap in the story? How does it reflect the theme?",marks:4,type:"SA"},
      {year:2023,q:"How did Edla's kindness bring about a transformation in the peddler?",marks:4,type:"SA"},
      {year:2022,q:"The story 'The Rattrap' is about human loneliness and the need to bond with others. Discuss.",marks:5,type:"LA"},
      {year:2021,q:"Why did the peddler decline the offer of the crofter to stay the night initially? What changed his mind?",marks:3,type:"SA"},
    ],
    e9:[
      {year:2024,q:"What emotions does the poet experience during the drive to the airport in 'My Mother at Sixty-Six'?",marks:3,type:"SA"},
      {year:2023,q:"What poetic devices has Kamala Das used in 'My Mother at Sixty-Six'? Explain any two.",marks:3,type:"SA"},
      {year:2022,q:"What does the imagery of 'late winter's moon' and 'dozing' convey in the poem?",marks:3,type:"SA"},
      {year:2021,q:"Why does the poet look outside at trees and children after looking at her mother?",marks:3,type:"SA"},
      {year:2020,q:"Explain the significance of the last two lines of the poem 'My Mother at Sixty-Six'.",marks:3,type:"SA"},
    ],
    e11:[
      {year:2024,q:"What is the 'exotic moment' the poet wishes for in 'Keeping Quiet'? Why does he call it exotic?",marks:4,type:"SA"},
      {year:2023,q:"Explain: 'Let's not speak in any language, let's stop for one second.' What is the poet urging?",marks:3,type:"SA"},
      {year:2022,q:"How does Pablo Neruda use the example of Earth and Nature to convey his message of 'Keeping Quiet'?",marks:4,type:"SA"},
      {year:2021,q:"Why does the poet say 'do not move your arms so much'? What does this signify?",marks:3,type:"SA"},
      {year:2020,q:"What does Neruda mean by 'a huge silence' and 'a moment without rush'?",marks:3,type:"SA"},
    ],
    e21:[
      {year:2024,q:"You are Shalini/Saurav, Head Girl/Boy of Sunrise Public School. Draft a notice for the school notice board informing students about Annual Sports Day to be held on 15th March.",marks:4,type:"SA"},
      {year:2023,q:"Draft a notice for the school notice board regarding an Inter-school Science Exhibition. You are Ravi/Riya, Cultural Secretary.",marks:4,type:"SA"},
      {year:2022,q:"You are the Secretary of the Literary Club. Write a notice informing students about an essay competition to be held next week.",marks:4,type:"SA"},
      {year:2021,q:"Write a notice for the school notice board about the Annual Blood Donation Camp. You are Arjun/Ananya, School Captain.",marks:4,type:"SA"},
    ],
    e23:[
      {year:2024,q:"Write an article in 150–200 words on 'The Impact of Artificial Intelligence on Employment' for your school magazine.",marks:6,type:"LA"},
      {year:2023,q:"Write an article on 'Social Media: A Boon or a Bane for Teenagers'.",marks:6,type:"LA"},
      {year:2022,q:"Write an article on 'The Importance of Mental Health Awareness among Students'.",marks:6,type:"LA"},
      {year:2021,q:"Write an article on 'Online Education during the Pandemic: Challenges and Opportunities'.",marks:6,type:"LA"},
      {year:2020,q:"Write an article on 'Climate Change and Its Impact on Our Lives'.",marks:6,type:"LA"},
      {year:2019,q:"Write an article on 'The Importance of Physical Education in Schools'.",marks:6,type:"LA"},
    ],
    e24:[
      {year:2024,q:"You are a reporter for 'The City Herald'. Write a report on the Annual Prize Distribution Ceremony of your school held recently.",marks:6,type:"LA"},
      {year:2023,q:"Write a report on the road accident that occurred near your school last week.",marks:6,type:"LA"},
      {year:2022,q:"Write a report for your school magazine on the Tree Plantation Drive conducted by the Eco Club.",marks:6,type:"LA"},
      {year:2021,q:"Write a report on the Science and Technology Exhibition held at your school.",marks:6,type:"LA"},
    ],
    e25:[
      {year:2024,q:"Write a speech to be delivered in the school assembly on 'The Importance of Discipline in Student Life'.",marks:6,type:"LA"},
      {year:2023,q:"Write a speech on 'How Reading Books Can Change Your Life' to be delivered at a school function.",marks:6,type:"LA"},
      {year:2022,q:"You are the Head Boy/Girl. Write a speech on 'Role of Youth in Nation Building'.",marks:6,type:"LA"},
      {year:2021,q:"Write a speech on 'Need to Save Environment' to be delivered at an inter-school debate competition.",marks:6,type:"LA"},
    ],
  },
  maths: {
    m2:[
      {year:2024,q:"If A = [[2,3],[1,4]] and B = [[1,0],[2,1]], find AB and BA. Is AB = BA?",marks:4,type:"SA"},
      {year:2023,q:"If A is a 3×2 matrix and B is a 2×4 matrix, what is the order of AB? Calculate AB if A = [[1,2],[3,4],[5,6]] and B = [[1,0,1,0],[0,1,0,1]].",marks:4,type:"SA"},
      {year:2022,q:"Prove that for a square matrix A, A + A' is symmetric and A - A' is skew-symmetric.",marks:4,type:"SA"},
      {year:2021,q:"Find the transpose of A = [[1,2,3],[4,5,6]]. If A = [[1,2],[3,4]], verify AA' ≠ A'A.",marks:3,type:"SA"},
      {year:2020,q:"If A = [[cosθ, sinθ],[-sinθ, cosθ]], show that A² = [[cos2θ, sin2θ],[-sin2θ, cos2θ]].",marks:4,type:"SA"},
      {year:2019,q:"State the conditions for two matrices to be conformable for multiplication. If A is of order m×n, what should be the order of B for AB to exist?",marks:2,type:"SA"},
    ],
    m3:[
      {year:2024,q:"Find the area of the triangle with vertices A(1,2), B(3,4), C(2,0) using determinants.",marks:3,type:"SA"},
      {year:2023,q:"Solve the system of equations using Cramer's Rule: 2x + y = 5; x + 3y = 7.",marks:4,type:"SA"},
      {year:2022,q:"Find the inverse of A = [[2,1],[5,3]] using adjoint method. Verify AA⁻¹ = I.",marks:4,type:"SA"},
      {year:2021,q:"If |2x, 5; 8, x| = |6, 5; 8, 3|, find the value of x.",marks:2,type:"SA"},
      {year:2020,q:"Using determinants, show that the points (1,1), (2,3), (3,5) are collinear.",marks:3,type:"SA"},
      {year:2019,q:"Expand: |1,2,3; 4,5,6; 7,8,9| and state a property of determinants observed from your answer.",marks:3,type:"SA"},
    ],
    m4:[
      {year:2024,q:"Differentiate the following with respect to x: (a) y = x⁴ - 3x³ + 5x - 7 (b) y = (x² + 1)(x³ - x) (c) y = sin x · eˣ.",marks:4,type:"SA"},
      {year:2023,q:"Find dy/dx using chain rule: (a) y = (3x² + 5)⁴ (b) y = √(x² + 1).",marks:3,type:"SA"},
      {year:2022,q:"If y = x·sin x, find dy/dx. Also find the second derivative d²y/dx².",marks:3,type:"SA"},
      {year:2021,q:"Differentiate y = log(x² + 3x + 2) with respect to x.",marks:2,type:"SA"},
      {year:2020,q:"Find dy/dx if x² + y² = 25 (implicit differentiation).",marks:2,type:"SA"},
      {year:2019,q:"Differentiate y = eˣ + log x + x⁵ with respect to x.",marks:2,type:"SA"},
    ],
    m5:[
      {year:2024,q:"Find the maximum and minimum values of f(x) = 2x³ - 3x² - 36x + 10.",marks:4,type:"SA"},
      {year:2023,q:"A company's revenue function is R(x) = 400x - 2x². Find: (a) Marginal Revenue (b) Quantity at which MR = 0 (c) Maximum Revenue.",marks:4,type:"SA"},
      {year:2022,q:"The cost function is C(x) = x³ - 6x² + 20x + 50. Find: (a) Marginal Cost when x = 4 (b) Average Cost when x = 5.",marks:3,type:"SA"},
      {year:2021,q:"A firm's demand function is p = 100 - 4x. Find the price and quantity that maximise revenue.",marks:3,type:"SA"},
      {year:2020,q:"Find the intervals on which f(x) = x³ - 3x + 2 is increasing and decreasing.",marks:3,type:"SA"},
      {year:2019,q:"A farmer has 400 metres of fencing. He wants to fence a rectangular field. Find the maximum area.",marks:4,type:"SA"},
    ],
    m8:[
      {year:2024,q:"In a binomial distribution, n = 10 and p = 0.4. Find: (a) Mean (b) Variance (c) P(X = 3).",marks:4,type:"SA"},
      {year:2023,q:"A fair die is thrown twice. X = sum of numbers. Find E(X) and Var(X).",marks:4,type:"SA"},
      {year:2022,q:"Define a Random Variable. A coin is tossed 3 times. X = number of heads. Write the probability distribution of X and find E(X).",marks:4,type:"SA"},
      {year:2021,q:"If X ~ B(n=8, p=1/2), find P(X ≥ 6).",marks:3,type:"SA"},
      {year:2020,q:"The mean of a binomial distribution is 4 and its standard deviation is √2. Find n and p.",marks:3,type:"SA"},
    ],
    m10:[
      {year:2024,q:"Calculate Laspeyre's and Paasche's Price Index from the given data: [Commodity A: p₀=10, q₀=100, p₁=15, q₁=80; Commodity B: p₀=20, q₀=50, p₁=25, q₁=60]",marks:4,type:"SA"},
      {year:2023,q:"What is a Cost of Living Index? How is it constructed? State its uses.",marks:4,type:"SA"},
      {year:2022,q:"Calculate the simple aggregate price index for the following data: A: ₹20 to ₹25; B: ₹40 to ₹50; C: ₹10 to ₹12.",marks:3,type:"SA"},
      {year:2021,q:"What is Fisher's Ideal Index? Why is it called 'ideal'?",marks:3,type:"SA"},
    ],
    m13:[
      {year:2024,q:"Solve graphically: Maximise Z = 5x + 4y, subject to: x + y ≤ 5; 10x + 6y ≤ 40; x,y ≥ 0.",marks:5,type:"LA"},
      {year:2023,q:"A company manufactures two products A and B. Product A requires 2 hours on machine M1 and 1 hour on M2. Product B requires 1 hour on M1 and 2 hours on M2. Machines M1 and M2 have 12 and 10 hours available respectively. Profit is ₹5 on A and ₹4 on B. Formulate as LPP and solve graphically.",marks:5,type:"LA"},
      {year:2022,q:"Define: (a) Feasible Region (b) Optimal Solution (c) Objective Function in LPP.",marks:3,type:"SA"},
      {year:2021,q:"Minimise Z = 3x + 5y, subject to: x + y ≥ 4; x + 3y ≥ 6; x,y ≥ 0. Solve graphically.",marks:4,type:"SA"},
      {year:2020,q:"What is a 'Corner Point' in LPP? State the theorem used to find the optimal solution.",marks:2,type:"SA"},
    ],
    m12:[
      {year:2024,q:"Find the EMI on a home loan of ₹10,00,000 at 9% p.a. for 10 years. (Use appropriate formula or table.)",marks:4,type:"SA"},
      {year:2023,q:"Calculate the future value of an annuity due of ₹2,000 per month for 3 years at 12% p.a. compounded monthly.",marks:4,type:"SA"},
      {year:2022,q:"What is the difference between annuity and annuity due? Calculate the present value of ₹5,000 received annually for 5 years at 10% p.a.",marks:4,type:"SA"},
      {year:2021,q:"A person deposits ₹1,000 at the end of each month for 2 years in a bank at 6% p.a. compounded monthly. Find the amount at the end of 2 years.",marks:3,type:"SA"},
      {year:2020,q:"Find compound interest on ₹50,000 for 2 years at 10% p.a. compounded semi-annually.",marks:3,type:"SA"},
    ],
  },
};


/* ═══════════════════════════════════════════════════════════
   PYQ BANK — PREVIOUS YEAR QUESTIONS
═══════════════════════════════════════════════════════════ */
const TYPE_META = {
  VSA:{label:"1 Mark",color:"#10b981",bg:"rgba(16,185,129,.12)"},
  SA: {label:"Short Ans",color:"#f59e0b",bg:"rgba(245,158,11,.12)"},
  LA: {label:"Long Ans",color:"#7c3aed",bg:"rgba(124,58,237,.12)"},
};

function PYQBank() {
  const [sub,setSub]=useState("accounts");
  const [chId,setChId]=useState(null);
  const [yearFilter,setYearFilter]=useState(null);
  const [typeFilter,setTypeFilter]=useState(null);
  const [search,setSearch]=useState("");
  const [aiAnswers,setAiAnswers]=useState({});
  const [loadingId,setLoadingId]=useState(null);
  const [attemptId,setAttemptId]=useState(null);
  const [userAns,setUserAns]=useState({});
  const [revealId,setRevealId]=useState(null);

  const subChapters=useMemo(()=>SYLLABUS[sub]||[],[sub]);
  const pyqSub=PYQ_DATA[sub]||{};

  // chapters that have PYQ data
  const chaptersWithData=useMemo(()=>subChapters.filter(c=>pyqSub[c.id]?.length),[subChapters,pyqSub]);

  // frequency map: chId → count
  const freqMap=useMemo(()=>{
    const m={};
    Object.entries(pyqSub).forEach(([cid,qs])=>{m[cid]=qs.length;});
    return m;
  },[pyqSub]);

  // auto-select first chapter on subject change
  useEffect(()=>{
    const first=chaptersWithData[0];
    setChId(first?first.id:null);
    setYearFilter(null);setTypeFilter(null);setSearch("");
  },[sub]);

  // questions for current chapter
  const rawQs=useMemo(()=>(chId&&pyqSub[chId])||[],[chId,pyqSub]);

  // available years for this chapter
  const years=useMemo(()=>[...new Set(rawQs.map(q=>q.year))].sort((a,b)=>b-a),[rawQs]);

  // filtered questions
  const questions=useMemo(()=>{
    let q=rawQs.map((x,origIdx)=>({...x,_origIdx:origIdx}));
    if(yearFilter) q=q.filter(x=>x.year===yearFilter);
    if(typeFilter) q=q.filter(x=>x.type===typeFilter);
    if(search.trim()) q=q.filter(x=>x.q.toLowerCase().includes(search.toLowerCase()));
    return q.sort((a,b)=>b.year-a.year);
  },[rawQs,yearFilter,typeFilter,search]);

  const hotChapters=useMemo(()=>chaptersWithData.filter(c=>freqMap[c.id]>=6),[chaptersWithData,freqMap]);

  const getAIAnswer=async(q,idx)=>{
    const key=`${chId}_${idx}`;
    if(aiAnswers[key]){setRevealId(key);return;}
    setLoadingId(key);
    const chName=subChapters.find(c=>c.id===chId)?.name||"";
    const subName=SUBJECTS[sub]?.name||"";
    const system=`You are an expert CBSE Class 12 ${subName} teacher. Provide a perfect model answer for the given board exam question. Format your answer clearly with key points. Be concise but complete. Mention marks distribution if applicable. Use CBSE answer writing style.`;
    const msg=[{role:"user",content:`Chapter: ${chName} | Marks: ${q.marks} | Year: ${q.year}\n\nQuestion: ${q.q}\n\nProvide a model answer for this CBSE Class 12 board exam question.`}];
    const ans=await callClaude(msg,system);
    setAiAnswers(p=>({...p,[key]:ans}));
    setLoadingId(null);
    setRevealId(key);
  };

  const chapterName=subChapters.find(c=>c.id===chId)?.name||"";
  const totalQs=rawQs.length;

  return(
    <div style={{display:"flex",height:"calc(100vh - 0px)",overflow:"hidden"}} className="fi">
      {/* LEFT: chapter selector */}
      <div style={{width:260,borderRight:"1px solid var(--brd)",overflowY:"auto",padding:"24px 12px",flexShrink:0,background:"var(--surf)"}}>
        {/* Subject tabs */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8,paddingLeft:4}}>Subject</div>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            {Object.entries(SUBJECTS).map(([k,s])=>(
              <button key={k} onClick={()=>setSub(k)} style={{
                display:"flex",alignItems:"center",gap:9,padding:"8px 11px",borderRadius:9,
                border:`1px solid ${sub===k?"rgba(124,58,237,.4)":"transparent"}`,
                background:sub===k?"var(--glass2)":"transparent",
                color:sub===k?"var(--txt)":"var(--txt2)",
                fontSize:12,fontWeight:sub===k?700:400,textAlign:"left",cursor:"pointer",
                transition:"all .15s",
              }}>
                <span style={{fontSize:14}}>{s.icon}</span>
                <span>{s.short}</span>
                {sub===k&&<span style={{marginLeft:"auto",fontSize:10,color:"var(--acc)",fontWeight:700}}>{Object.values(PYQ_DATA[k]||{}).flat().length}Q</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{height:1,background:"var(--brd)",margin:"12px 0"}}/>

        {/* Hot Chapters */}
        {hotChapters.length>0&&(
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:"#ef4444",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6,paddingLeft:4}}>🔥 Most Asked</div>
            {hotChapters.map(c=>(
              <button key={c.id} onClick={()=>setChId(c.id)} style={{
                display:"flex",justifyContent:"space-between",alignItems:"center",
                width:"100%",padding:"7px 11px",borderRadius:8,border:"1px solid transparent",
                background:chId===c.id?"rgba(239,68,68,.12)":"transparent",
                color:chId===c.id?"#ef4444":"var(--txt2)",
                fontSize:11,fontWeight:chId===c.id?700:400,textAlign:"left",cursor:"pointer",
                transition:"all .15s",
              }}>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>{c.name}</span>
                <span style={{fontSize:10,background:"rgba(239,68,68,.15)",color:"#ef4444",borderRadius:99,padding:"1px 6px",flexShrink:0}}>{freqMap[c.id]}</span>
              </button>
            ))}
            <div style={{height:1,background:"var(--brd)",margin:"10px 0"}}/>
          </div>
        )}

        {/* All chapters */}
        <div style={{fontSize:10,fontWeight:700,color:"var(--txt3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6,paddingLeft:4}}>All Chapters</div>
        {chaptersWithData.map(c=>(
          <button key={c.id} onClick={()=>setChId(c.id)} style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",
            width:"100%",padding:"7px 11px",borderRadius:8,
            border:`1px solid ${chId===c.id?"rgba(124,58,237,.35)":"transparent"}`,
            background:chId===c.id?"var(--glass2)":"transparent",
            color:chId===c.id?"var(--txt)":"var(--txt2)",
            fontSize:11,fontWeight:chId===c.id?700:400,textAlign:"left",cursor:"pointer",
            transition:"all .15s",marginBottom:2,
          }}>
            <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:168}}>{c.name}</span>
            <span style={{fontSize:10,background:"var(--glass2)",color:"var(--txt3)",borderRadius:99,padding:"1px 6px",flexShrink:0,marginLeft:4}}>{freqMap[c.id]}</span>
          </button>
        ))}
        {chaptersWithData.length===0&&<div style={{fontSize:12,color:"var(--txt3)",padding:"8px 11px"}}>No PYQs available yet</div>}
      </div>

      {/* RIGHT: question area */}
      <div style={{flex:1,overflowY:"auto",padding:"28px 36px"}}>
        {chId?(
          <>
            {/* Header */}
            <div style={{marginBottom:22}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:12}}>
                <div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:18,fontWeight:800,color:"var(--txt)",marginBottom:4}}>{chapterName}</div>
                  <div style={{fontSize:12,color:"var(--txt2)"}}>{SUBJECTS[sub]?.name} · CBSE 2015–2024</div>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <div style={{background:"var(--glass2)",border:"1px solid var(--brd2)",borderRadius:10,padding:"8px 16px",textAlign:"center"}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:800,color:"var(--acc)"}}>{totalQs}</div>
                    <div style={{fontSize:10,color:"var(--txt3)"}}>Total PYQs</div>
                  </div>
                  <div style={{background:"var(--glass2)",border:"1px solid var(--brd2)",borderRadius:10,padding:"8px 16px",textAlign:"center"}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:800,color:"var(--grn)"}}>{years.length}</div>
                    <div style={{fontSize:10,color:"var(--txt3)"}}>Years Covered</div>
                  </div>
                  <div style={{background:"var(--glass2)",border:"1px solid var(--brd2)",borderRadius:10,padding:"8px 16px",textAlign:"center"}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:800,color:"var(--amb)"}}>{rawQs.reduce((a,q)=>Math.max(a,q.marks),0)}</div>
                    <div style={{fontSize:10,color:"var(--txt3)"}}>Max Marks</div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search questions…"
                  style={{background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:9,padding:"7px 13px",color:"var(--txt)",fontSize:12,minWidth:200}}/>

                {/* Year filter */}
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {[null,...years.slice(0,8)].map(y=>(
                    <button key={y??'all'} onClick={()=>setYearFilter(y)} style={{
                      padding:"5px 10px",borderRadius:7,fontSize:11,fontWeight:yearFilter===y?700:400,
                      border:`1px solid ${yearFilter===y?"var(--acc)":"var(--brd)"}`,
                      background:yearFilter===y?"var(--acc)":"transparent",
                      color:yearFilter===y?"#fff":"var(--txt3)",cursor:"pointer",transition:"all .15s",
                    }}>{y??'All Years'}</button>
                  ))}
                </div>

                {/* Type filter */}
                <div style={{display:"flex",gap:4}}>
                  {[null,"VSA","SA","LA"].map(t=>(
                    <button key={t??'all'} onClick={()=>setTypeFilter(t)} style={{
                      padding:"5px 10px",borderRadius:7,fontSize:11,fontWeight:typeFilter===t?700:400,
                      border:`1px solid ${typeFilter===t?"rgba(124,58,237,.5)":"var(--brd)"}`,
                      background:typeFilter===t?"var(--glass2)":"transparent",
                      color:typeFilter===t?"var(--acc)":"var(--txt3)",cursor:"pointer",transition:"all .15s",
                    }}>{t??'All Types'}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions */}
            {questions.length===0?(
              <Card style={{padding:40,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:12}}>🔍</div>
                <div style={{fontSize:14,color:"var(--txt2)"}}>No questions match your filters.</div>
              </Card>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {questions.map((q,i)=>{
                  const key=`${chId}_${q._origIdx}`;
                  const tm=TYPE_META[q.type]||TYPE_META.SA;
                  const isAttempting=attemptId===key;
                  const hasAnswer=!!aiAnswers[key];
                  const isRevealed=revealId===key;
                  const isLoading=loadingId===key;
                  return(
                    <Card key={key} style={{padding:20,transition:"all .2s"}} className="card-hov">
                      {/* Top row */}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,gap:10}}>
                        <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                          <span style={{background:"rgba(124,58,237,.12)",color:"var(--acc)",borderRadius:7,padding:"3px 10px",fontSize:11,fontWeight:700,letterSpacing:".04em"}}>
                            {q.year}
                          </span>
                          <span style={{background:tm.bg,color:tm.color,borderRadius:7,padding:"3px 10px",fontSize:11,fontWeight:600}}>
                            {tm.label}
                          </span>
                          <span style={{background:"var(--glass2)",color:"var(--txt2)",borderRadius:7,padding:"3px 10px",fontSize:11,fontWeight:600}}>
                            {q.marks} {q.marks===1?"Mark":"Marks"}
                          </span>
                        </div>
                        <div style={{fontSize:12,color:"var(--txt3)",fontWeight:600,flexShrink:0}}>Q{i+1}</div>
                      </div>

                      {/* Question text */}
                      <div style={{fontSize:14,color:"var(--txt)",lineHeight:1.7,marginBottom:16,fontWeight:500}}>
                        {q.q}
                      </div>

                      {/* Attempt area */}
                      {isAttempting&&(
                        <div style={{marginBottom:14}}>
                          <textarea
                            value={userAns[key]||""}
                            onChange={e=>setUserAns(p=>({...p,[key]:e.target.value}))}
                            placeholder="Write your answer here… then click 'Check with AI' to compare."
                            rows={5}
                            style={{width:"100%",background:"var(--glass)",border:"1px solid var(--brd2)",borderRadius:10,padding:"12px 14px",color:"var(--txt)",fontSize:13,resize:"vertical",lineHeight:1.6}}
                          />
                        </div>
                      )}

                      {/* AI Answer */}
                      {isRevealed&&hasAnswer&&(
                        <div style={{background:"linear-gradient(135deg,rgba(124,58,237,.06),rgba(79,70,229,.04))",border:"1px solid rgba(124,58,237,.2)",borderRadius:12,padding:16,marginBottom:14}}>
                          <div style={{fontSize:11,fontWeight:700,color:"var(--acc)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>🤖 Model Answer</div>
                          <div style={{fontSize:13,color:"var(--txt)",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{aiAnswers[key]}</div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {!isAttempting?(
                          <Btn size="sm" variant="secondary" onClick={()=>{setAttemptId(key);setRevealId(null);}}>✏️ Attempt</Btn>
                        ):(
                          <Btn size="sm" variant="secondary" onClick={()=>setAttemptId(null)}>✕ Cancel</Btn>
                        )}

                        {isLoading?(
                          <Btn size="sm" variant="outline" disabled><Spinner/> <span style={{marginLeft:6}}>Getting answer…</span></Btn>
                        ):isRevealed?(
                          <Btn size="sm" variant="ghost" onClick={()=>setRevealId(null)}>Hide Answer ▲</Btn>
                        ):(
                          <Btn size="sm" variant="primary" onClick={()=>getAIAnswer(q,q._origIdx)}>
                            {hasAnswer?"Show Model Answer":"🤖 Get Model Answer"}
                          </Btn>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ):(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",gap:16}}>
            <div style={{fontSize:48}}>📋</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:18,color:"var(--txt)"}}>Select a Chapter</div>
            <div style={{fontSize:13,color:"var(--txt3)"}}>Choose a chapter from the left to see previous year questions</div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
// ── localStorage helpers ──────────────────────────────────
const LS_KEY = (email) => `studypod_${email.replace(/[^a-z0-9]/gi,"_")}`;

function loadUserData(email) {
  try {
    const raw = localStorage.getItem(LS_KEY(email));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveUserData(email, data) {
  try {
    localStorage.setItem(LS_KEY(email), JSON.stringify(data));
  } catch {}
}

export default function App() {
  const [user,setUser]=useState(()=>{
    // auto-restore last logged-in user session
    try {
      const saved = localStorage.getItem("studypod_session");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [tab,setTab]=useState("dashboard");
  const [chapters,setCh]=useState(initChapters);
  const [streak,setStreak]=useState({count:0,lastDate:null});
  // activityMap: { "2025-05-25": 3 } — real events per day
  const [activityMap,setActivityMap]=useState({});
  const heatmap=useMemo(()=>mergeActivity(buildHeatmapGrid(),activityMap),[activityMap]);
  const recordActivity=useCallback((n=1)=>{
    setActivityMap(prev=>({...prev,[todayStr()]:(prev[todayStr()]||0)+n}));
  },[]);

  const [goals,setGoals]=useState([
    {text:"Study 1 new chapter",done:false},
    {text:"Complete today's revisions",done:false},
    {text:"Do 2 Pomodoro sessions",done:false},
  ]);
  const [scores,setScores]=useState([]);
  const [notes,setNotes]=useState({});
  const [pomodoroSessions,setPomodoroSessions]=useState(0);
  const [quizPerfect,setQuizPerfect]=useState(false);
  const [flashcardCount,setFlashcardCount]=useState(0);
  const [isDark,setIsDark]=useState(()=>{try{return localStorage.getItem("studypod_dark")==="1";}catch{return false;}});

  // ── Persist dark-mode preference
  useEffect(()=>{try{localStorage.setItem("studypod_dark",isDark?"1":"0");}catch{}},[isDark]);

  const allCh=useMemo(()=>Object.values(chapters).flat(),[chapters]);
  const totalCh=allCh.length;
  const doneCh=allCh.filter(c=>c.status!=="pending").length;
  const mastCh=allCh.filter(c=>c.status==="mastered").length;
  const dueRevs=allCh.filter(c=>c.nextRevision&&c.nextRevision<=todayStr());

  const updateStreak=useCallback(()=>{
    setStreak(p=>{const t=todayStr();if(p.lastDate===t)return p;return{count:p.lastDate===addDays(t,-1)?p.count+1:1,lastDate:t};});
  },[]);

  const markStudied=useCallback((sub,id)=>{
    setCh(prev=>{const up={...prev};up[sub]=prev[sub].map(c=>{if(c.id!==id)return c;const d=todayStr();return{...c,status:"studied",studiedDate:d,revisionIndex:0,nextRevision:addDays(d,INTERVALS[0]),revisionHistory:[]};});return up;});
    updateStreak(); recordActivity(1);
  },[updateStreak,recordActivity]);

  const markRevised=useCallback((sub,id)=>{
    setCh(prev=>{const up={...prev};up[sub]=prev[sub].map(c=>{if(c.id!==id)return c;const ni=c.revisionIndex+1;const mas=ni>=INTERVALS.length;return{...c,status:mas?"mastered":"studied",revisionIndex:ni,nextRevision:mas?null:addDays(todayStr(),INTERVALS[ni]),revisionHistory:[...c.revisionHistory,todayStr()]};});return up;});
    updateStreak(); recordActivity(1);
  },[updateStreak,recordActivity]);

  // ── On mount: if session was restored, also restore study data ─
  useEffect(()=>{
    if(!user) return;
    const saved = loadUserData(user.email);
    if(saved) {
      if(saved.chapters)    setCh(saved.chapters);
      if(saved.streak)      setStreak(saved.streak);
      if(saved.activityMap) setActivityMap(saved.activityMap);
      if(saved.goals)       setGoals(saved.goals);
      if(saved.scores)      setScores(saved.scores);
      if(saved.notes)       setNotes(saved.notes);
      if(saved.pomodoroSessions) setPomodoroSessions(saved.pomodoroSessions);
      if(saved.quizPerfect) setQuizPerfect(true);
      if(saved.flashcardCount) setFlashcardCount(saved.flashcardCount);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);  // run once on mount only

  // ── Persist all study data whenever anything changes ─────
  useEffect(()=>{
    if(!user) return;
    const data = { chapters, streak, activityMap, goals, scores, notes, pomodoroSessions, quizPerfect, flashcardCount };
    saveUserData(user.email, data);
  }, [user, chapters, streak, activityMap, goals, scores, notes, pomodoroSessions, quizPerfect, flashcardCount]);

  // ── On login: restore saved data or start fresh ───────────
  const handleLogin=useCallback((u)=>{
    // save session for auto-login
    try { localStorage.setItem("studypod_session", JSON.stringify(u)); } catch {}
    const saved = loadUserData(u.email);
    if(saved) {
      if(saved.chapters)    setCh(saved.chapters);
      if(saved.streak)      setStreak(saved.streak);
      if(saved.activityMap) setActivityMap(saved.activityMap);
      if(saved.goals)       setGoals(saved.goals);
      if(saved.scores)      setScores(saved.scores);
      if(saved.notes)       setNotes(saved.notes);
      if(saved.pomodoroSessions) setPomodoroSessions(saved.pomodoroSessions);
      if(saved.quizPerfect) setQuizPerfect(true);
      if(saved.flashcardCount) setFlashcardCount(saved.flashcardCount);
    } else {
      // brand new user — fresh state
      setCh(initChapters());
      setStreak({count:0,lastDate:null});
      setActivityMap({});
      setNotes({});
      setGoals([
        {text:"Study 1 new chapter",done:false},
        {text:"Complete today's revisions",done:false},
        {text:"Do 2 Pomodoro sessions",done:false},
      ]);
      setScores([]);
      setPomodoroSessions(0);
    }
    // Merge any saved profile fields (bio, avatar, grade, etc.)
    const accs = (() => {try{return JSON.parse(localStorage.getItem("studypod_accounts")||"{}");}catch{return{};}})();
    const acct = accs[u.email] || {};
    setUser({...u, bio:acct.bio||"", avatar:acct.avatar||null, grade:acct.grade||"Class 12", preferredSubjects:acct.preferredSubjects||[]});
  },[]);

  const handleLogout=useCallback(()=>{
    // save final state before clearing session
    if(user) {
      const data={chapters,streak,activityMap,goals,scores,notes,pomodoroSessions,quizPerfect,flashcardCount};
      saveUserData(user.email,data);
    }
    try { localStorage.removeItem("studypod_session"); } catch {}
    setUser(null);
    setTab("dashboard");
    // reset state to clean slate for next login
    setCh(initChapters());
    setStreak({count:0,lastDate:null});
    setActivityMap({});
    setGoals([
      {text:"Study 1 new chapter",done:false},
      {text:"Complete today's revisions",done:false},
      {text:"Do 2 Pomodoro sessions",done:false},
    ]);
    setScores([]);
    setNotes({});
    setPomodoroSessions(0);
    setQuizPerfect(false);
    setFlashcardCount(0);
  },[user,chapters,streak,activityMap,goals,scores,notes,pomodoroSessions,quizPerfect,flashcardCount]);

  if(!user) return <><GS/><LoginPage onLogin={handleLogin}/></>;
  if(user.isAdmin) return <><GS/><AdminDashboard user={user} onLogout={handleLogout}/></>;

  const props={user,chapters,doneCh,totalCh,mastCh,dueRevs,streak:streak.count,scores,setScores};

  return(
    <>
      <GS/>
      <div className={isDark?"":"light"} style={{display:"flex",height:"100vh",overflow:"hidden",background:"var(--bg)",fontFamily:"'Inter',sans-serif",transition:"background .3s,color .3s"}}>
        <Sidebar tab={tab} setTab={setTab} user={user} dueCount={dueRevs.length} doneCh={doneCh} totalCh={totalCh} streak={streak.count} isDark={isDark} setIsDark={setIsDark}/>
        <div style={{flex:1,overflowY:"auto",background:"var(--bg)"}}>
          {tab==="dashboard"  &&<Dashboard {...props} heatmap={heatmap} activityMap={activityMap} goals={goals} setGoals={setGoals} setTab={setTab}/>}
          {tab==="chapters"   &&<ChapterTracker chapters={chapters} onMarkStudied={markStudied}/>}
          {tab==="revision"   &&<RevisionEngine chapters={chapters} dueRevs={dueRevs} onMarkRevised={markRevised}/>}
          {tab==="coach"      &&<AICoach/>}
          {tab==="flashcards" &&<Flashcards/>}
          {tab==="notes"      &&<Notes notes={notes} setNotes={setNotes}/>}
          {tab==="quiz"       &&<QuizGen/>}
          {tab==="formula"    &&<FormulaSheet/>}
          {tab==="planner"    &&<Planner chapters={chapters} dueRevs={dueRevs} user={user}/>}
          {tab==="scores"     &&<TestScores user={user} scores={scores} setScores={setScores}/>}
          {tab==="pomodoro"   &&<Pomodoro onSessionEnd={recordActivity} pomodoroSessions={pomodoroSessions} setPomodoroSessions={setPomodoroSessions}/>}
          {tab==="badges"     &&<AchievementsPage chapters={chapters} streak={streak.count} scores={scores} pomodoroSessions={pomodoroSessions} quizPerfect={quizPerfect} flashcardCount={flashcardCount}/>}
          {tab==="pyq"        &&<PYQBank/>}
          {tab==="profile"    &&<ProfilePage user={user} setUser={setUser}/>}
          {tab==="settings"   &&<Settings user={user} isDark={isDark} setIsDark={setIsDark} onLogout={handleLogout}/>}
        </div>
      </div>
    </>
  );
}
