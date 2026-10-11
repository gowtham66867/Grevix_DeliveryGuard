export const SAMPLE_PLAN = {
  id: 'northstar-launch', name: 'Northstar client portal', client: 'Northstar Advisory',
  currency: 'INR', revenue: 120000, budget: 70000, deadline: 16, latePenalty: 3000, minMargin: 0.2,
  resources: [
    {id:'lead', name:'Delivery lead', availableFrom:0},
    {id:'design', name:'Designer', availableFrom:0},
    {id:'backend', name:'Backend engineer', availableFrom:0},
    {id:'frontend', name:'Frontend engineer', availableFrom:0},
    {id:'qa', name:'QA engineer', availableFrom:0},
    {id:'backup', name:'Approved backup pool', availableFrom:0}
  ],
  tasks: [
    {id:'brief',name:'Confirm requirements',owner:'lead',days:2,cost:6000,required:true,value:10,deps:[],alternatives:[]},
    {id:'design',name:'Design client portal',owner:'design',days:3,cost:10000,required:true,value:9,deps:['brief'],alternatives:[]},
    {id:'api',name:'Build secure API',owner:'backend',days:5,cost:18000,required:true,value:10,deps:['brief'],alternatives:[]},
    {id:'ui',name:'Build portal interface',owner:'frontend',days:4,cost:14000,required:true,value:10,deps:['design'],alternatives:[{id:'backup-ui',name:'Use backup frontend engineer',owner:'backup',days:3,cost:20000,verification:'Confirm backup engineer capacity and ₹20,000 quote'}]},
    {id:'analytics',name:'Add usage analytics',owner:'frontend',days:2,cost:4000,required:false,value:3,deps:['ui'],alternatives:[]},
    {id:'qa',name:'Security and acceptance tests',owner:'qa',days:3,cost:6000,required:true,value:10,deps:['ui','api'],alternatives:[]},
    {id:'handoff',name:'Client handoff',owner:'lead',days:1,cost:2000,required:true,value:10,deps:['qa'],alternatives:[]},
    {id:'training',name:'Extra training workshop',owner:'lead',days:2,cost:3000,required:false,value:2,deps:['handoff'],alternatives:[]}
  ]
};
export const SCENARIOS = [
  {id:'staff',label:'Engineer unavailable',short:'Staffing',text:'The frontend engineer is unavailable until day 12.',disruption:{type:'resource',target:'frontend',value:12}},
  {id:'budget',label:'Budget reduced',short:'Budget',text:'Our budget is reduced to ₹58,000.',disruption:{type:'budget',target:'budget',value:58000}},
  {id:'deadline',label:'Deadline pulled forward',short:'Deadline',text:'The client deadline is now day 12.',disruption:{type:'deadline',target:'deadline',value:12}},
  {id:'impossible',label:'No feasible recovery',short:'Stress test',text:'Our budget is reduced to ₹30,000.',disruption:{type:'budget',target:'budget',value:30000}}
];
export const clone = x => structuredClone(x);
