var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
var DB_FILE = import_path.default.join(process.cwd(), "db.json");
app.use(import_express.default.json({ limit: "10mb" }));
function generateSeedData() {
  console.log("Generating 20 Companies and 100 Students seed data...");
  const provinces = ["\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E\u0E21\u0E2B\u0E32\u0E19\u0E04\u0E23", "\u0E19\u0E19\u0E17\u0E1A\u0E38\u0E23\u0E35", "\u0E0A\u0E25\u0E1A\u0E38\u0E23\u0E35", "\u0E23\u0E30\u0E22\u0E2D\u0E07", "\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", "\u0E20\u0E39\u0E40\u0E01\u0E47\u0E15", "\u0E02\u0E2D\u0E19\u0E41\u0E01\u0E48\u0E19", "\u0E19\u0E04\u0E23\u0E23\u0E32\u0E0A\u0E2A\u0E35\u0E21\u0E32", "\u0E1B\u0E17\u0E38\u0E21\u0E18\u0E32\u0E19\u0E35", "\u0E2A\u0E21\u0E38\u0E17\u0E23\u0E1B\u0E23\u0E32\u0E01\u0E32\u0E23"];
  const businessTypes = ["IT", "Manufacturing", "Logistics", "Construction", "Service"];
  const companyTemplates = [
    { name: "Innovative Tech Solutions (ITS)", type: "IT", prov: "\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E\u0E21\u0E2B\u0E32\u0E19\u0E04\u0E23", lat: 13.7456, lng: 100.5342, address: "99/1 \u0E2D\u0E32\u0E04\u0E32\u0E23\u0E1E\u0E0D\u0E32\u0E44\u0E17\u0E1E\u0E25\u0E32\u0E0B\u0E48\u0E32 \u0E16.\u0E1E\u0E0D\u0E32\u0E44\u0E17 \u0E40\u0E02\u0E15\u0E23\u0E32\u0E0A\u0E40\u0E17\u0E27\u0E35", allowance: 450, positions: "Software Engineer, Web Developer, UX/UI Design Trainee", slots: 5, acc: false, meal: false, transport: true, desc: "\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E1E\u0E31\u0E12\u0E19\u0E32\u0E0B\u0E2D\u0E1F\u0E15\u0E4C\u0E41\u0E27\u0E23\u0E4C\u0E0A\u0E31\u0E49\u0E19\u0E19\u0E33 \u0E21\u0E38\u0E48\u0E07\u0E40\u0E19\u0E49\u0E19\u0E01\u0E32\u0E23\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E2A\u0E23\u0E23\u0E04\u0E4C\u0E42\u0E21\u0E1A\u0E32\u0E22\u0E41\u0E2D\u0E1B\u0E41\u0E25\u0E30\u0E23\u0E30\u0E30\u0E1A\u0E1A\u0E04\u0E25\u0E32\u0E27\u0E14\u0E4C\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23\u0E02\u0E19\u0E32\u0E14\u0E43\u0E2B\u0E0D\u0E48" },
    { name: "Siam Logistics & Distribution", type: "Logistics", prov: "\u0E2A\u0E21\u0E38\u0E17\u0E23\u0E1B\u0E23\u0E32\u0E01\u0E32\u0E23", lat: 13.6012, lng: 100.6085, address: "142 \u0E16.\u0E40\u0E17\u0E1E\u0E32\u0E23\u0E31\u0E01\u0E29\u0E4C \u0E15.\u0E1A\u0E32\u0E07\u0E1E\u0E25\u0E35\u0E43\u0E2B\u0E0D\u0E48 \u0E2D.\u0E1A\u0E32\u0E07\u0E1E\u0E25\u0E35", allowance: 300, positions: "Logistics Coordinator, Warehouse Operations Assistant", slots: 4, acc: false, meal: true, transport: true, desc: "\u0E1C\u0E39\u0E49\u0E43\u0E2B\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E04\u0E25\u0E31\u0E07\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E41\u0E25\u0E30\u0E0B\u0E31\u0E1E\u0E1E\u0E25\u0E32\u0E22\u0E40\u0E0A\u0E19\u0E23\u0E32\u0E22\u0E43\u0E2B\u0E0D\u0E48\u0E02\u0E2D\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28" },
    { name: "Eastern Star Automotive Parts", type: "Manufacturing", prov: "\u0E23\u0E30\u0E22\u0E2D\u0E07", lat: 12.9241, lng: 101.1632, address: "\u0E34\u0E3488 \u0E19\u0E34\u0E04\u0E21\u0E2D\u0E38\u0E15\u0E2A\u0E32\u0E2B\u0E01\u0E23\u0E23\u0E21\u0E2D\u0E21\u0E15\u0E30\u0E0B\u0E34\u0E15\u0E35\u0E49\u0E23\u0E30\u0E22\u0E2D\u0E07 \u0E15.\u0E21\u0E32\u0E1A\u0E22\u0E32\u0E07\u0E1E\u0E23 \u0E2D.\u0E1B\u0E25\u0E27\u0E01\u0E41\u0E14\u0E07", allowance: 380, positions: "Industrial Engineer Intern, Production Control Trainee", slots: 6, acc: true, meal: true, transport: true, desc: "\u0E1C\u0E39\u0E49\u0E1C\u0E25\u0E34\u0E15\u0E0A\u0E34\u0E49\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E22\u0E32\u0E19\u0E22\u0E19\u0E15\u0E4C\u0E2A\u0E48\u0E07\u0E2D\u0E2D\u0E01\u0E21\u0E32\u0E15\u0E23\u0E10\u0E32\u0E19\u0E2A\u0E32\u0E01\u0E25 \u0E21\u0E35\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E34\u0E01\u0E32\u0E23\u0E2B\u0E2D\u0E1E\u0E31\u0E01\u0E1F\u0E23\u0E35\u0E41\u0E25\u0E30\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E01\u0E25\u0E32\u0E07\u0E27\u0E31\u0E19\u0E04\u0E23\u0E1A\u0E04\u0E23\u0E31\u0E19" },
    { name: "Lanna Creative Digital Agency", type: "IT", prov: "\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", lat: 18.7963, lng: 98.9745, address: "24/3 \u0E16.\u0E2B\u0E49\u0E27\u0E22\u0E41\u0E01\u0E49\u0E27 \u0E15.\u0E2A\u0E38\u0E40\u0E17\u0E1E \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07", allowance: 250, positions: "Graphic Designer, Content Creator, Digital Marketer", slots: 3, acc: true, meal: false, transport: false, desc: "\u0E40\u0E2D\u0E40\u0E08\u0E19\u0E0B\u0E35\u0E48\u0E42\u0E06\u0E29\u0E13\u0E32\u0E41\u0E25\u0E30\u0E2A\u0E37\u0E48\u0E2D\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E2A\u0E23\u0E23\u0E04\u0E4C\u0E23\u0E38\u0E48\u0E19\u0E43\u0E2B\u0E21\u0E48 \u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E01\u0E32\u0E23\u0E17\u0E33\u0E07\u0E32\u0E19\u0E41\u0E1A\u0E1A\u0E01\u0E31\u0E19\u0E40\u0E2D\u0E07 \u0E43\u0E01\u0E25\u0E49\u0E0A\u0E34\u0E14\u0E18\u0E23\u0E23\u0E21\u0E0A\u0E32\u0E15\u0E34 \u0E21\u0E38\u0E48\u0E07\u0E40\u0E19\u0E49\u0E19\u0E04\u0E27\u0E32\u0E21\u0E2D\u0E34\u0E2A\u0E23\u0E30" },
    { name: "Andaman Grand Pearl Resort & Spa", type: "Service", prov: "\u0E20\u0E39\u0E40\u0E01\u0E47\u0E15", lat: 7.8924, lng: 98.2952, address: "101/5 \u0E16.\u0E17\u0E27\u0E35\u0E27\u0E07\u0E28\u0E4C \u0E15.\u0E1B\u0E48\u0E32\u0E15\u0E2D\u0E07 \u0E2D.\u0E01\u0E23\u0E30\u0E17\u0E39\u0E49", allowance: 400, positions: "Hotel Management Trainee, Customer Relations Officer, Food & Beverage Intern", slots: 8, acc: true, meal: true, transport: false, desc: "\u0E42\u0E23\u0E07\u0E41\u0E23\u0E21\u0E23\u0E30\u0E14\u0E31\u0E1A 5 \u0E14\u0E32\u0E27\u0E23\u0E34\u0E21\u0E2B\u0E32\u0E14\u0E1B\u0E48\u0E32\u0E15\u0E2D\u0E07 \u0E21\u0E2D\u0E1A\u0E1B\u0E23\u0E30\u0E2A\u0E1A\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E07\u0E32\u0E19\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E1E\u0E23\u0E35\u0E40\u0E21\u0E35\u0E22\u0E21\u0E41\u0E01\u0E48\u0E1C\u0E39\u0E49\u0E40\u0E23\u0E35\u0E22\u0E19\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E04\u0E23\u0E2D\u0E1A\u0E04\u0E25\u0E38\u0E21" },
    { name: "Chonburi Heavy Construction PLC", type: "Construction", prov: "\u0E0A\u0E25\u0E1A\u0E38\u0E23\u0E35", lat: 13.3611, lng: 100.9841, address: "77 \u0E16.\u0E1B\u0E23\u0E30\u0E08\u0E31\u0E01\u0E29\u0E4C\u0E28\u0E34\u0E25\u0E1B\u0E32\u0E04\u0E21 \u0E15.\u0E40\u0E2A\u0E21\u0E47\u0E14 \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07", allowance: 350, positions: "Civil Engineer Trainee, Site Safety Coordinator, Estimator Assistant", slots: 5, acc: false, meal: true, transport: true, desc: "\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E23\u0E31\u0E1A\u0E40\u0E2B\u0E21\u0E32\u0E01\u0E48\u0E2D\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E42\u0E22\u0E18\u0E32\u0E41\u0E25\u0E30\u0E07\u0E32\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E02\u0E19\u0E32\u0E14\u0E43\u0E2B\u0E0D\u0E48\u0E43\u0E19\u0E40\u0E02\u0E15\u0E1E\u0E31\u0E12\u0E19\u0E32\u0E1E\u0E34\u0E40\u0E28\u0E29\u0E20\u0E32\u0E04\u0E15\u0E30\u0E27\u0E31\u0E19\u0E2D\u0E2D\u0E01 (EEC)" },
    { name: "KK Cyber Security Services", type: "IT", prov: "\u0E02\u0E2D\u0E19\u0E41\u0E01\u0E48\u0E19", lat: 16.4423, lng: 102.8318, address: "320/2 \u0E16.\u0E21\u0E34\u0E15\u0E23\u0E20\u0E32\u0E1E \u0E15.\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07 \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07", allowance: 300, positions: "Security Analyst Intern, IT Support Assistant", slots: 4, acc: false, meal: false, transport: true, desc: "\u0E1C\u0E39\u0E49\u0E19\u0E33\u0E14\u0E49\u0E32\u0E19\u0E01\u0E32\u0E23\u0E23\u0E31\u0E01\u0E29\u0E32\u0E04\u0E27\u0E32\u0E21\u0E1B\u0E25\u0E2D\u0E14\u0E20\u0E31\u0E22\u0E23\u0E30\u0E1A\u0E1A\u0E44\u0E2D\u0E17\u0E35\u0E43\u0E19\u0E20\u0E32\u0E04\u0E15\u0E30\u0E27\u0E31\u0E19\u0E2D\u0E2D\u0E01\u0E40\u0E09\u0E35\u0E22\u0E07\u0E40\u0E2B\u0E19\u0E37\u0E2D" },
    { name: "Korat Food Processing Industry", type: "Manufacturing", prov: "\u0E19\u0E04\u0E23\u0E23\u0E32\u0E0A\u0E2A\u0E35\u0E21\u0E32", lat: 14.9742, lng: 102.0911, address: "444 \u0E15.\u0E42\u0E04\u0E01\u0E01\u0E23\u0E27\u0E14 \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E19\u0E04\u0E23\u0E23\u0E32\u0E0A\u0E2A\u0E35\u0E21\u0E32", allowance: 320, positions: "Food Technologist, Quality Assurance Assistant, Maintenance Electrician", slots: 6, acc: true, meal: true, transport: true, desc: "\u0E42\u0E23\u0E07\u0E07\u0E32\u0E19\u0E2D\u0E38\u0E15\u0E2A\u0E32\u0E2B\u0E01\u0E23\u0E23\u0E21\u0E41\u0E1B\u0E23\u0E23\u0E39\u0E1B\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E2A\u0E48\u0E07\u0E2D\u0E2D\u0E01\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28 \u0E21\u0E35\u0E2A\u0E34\u0E48\u0E07\u0E2D\u0E33\u0E19\u0E27\u0E22\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E30\u0E14\u0E27\u0E01\u0E04\u0E23\u0E1A\u0E40\u0E01\u0E13\u0E11\u0E4C\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E34\u0E01\u0E32\u0E23\u0E17\u0E35\u0E48\u0E14\u0E35\u0E14\u0E35" },
    { name: "Metro Infra Build", type: "Construction", prov: "\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E\u0E21\u0E2B\u0E32\u0E19\u0E04\u0E23", lat: 13.8041, lng: 100.5612, address: "19 \u0E16.\u0E27\u0E34\u0E20\u0E32\u0E27\u0E14\u0E35\u0E23\u0E31\u0E07\u0E2A\u0E34\u0E15 \u0E41\u0E02\u0E27\u0E07\u0E08\u0E15\u0E38\u0E08\u0E31\u0E01\u0E23 \u0E40\u0E02\u0E15\u0E08\u0E15\u0E38\u0E08\u0E31\u0E01\u0E23", allowance: 380, positions: "Site Engineer, Assistant Architect, Quantity Surveyor Assistant", slots: 4, acc: false, meal: true, transport: true, desc: "\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E07\u0E32\u0E19\u0E1E\u0E31\u0E12\u0E19\u0E32\u0E42\u0E04\u0E23\u0E07\u0E01\u0E32\u0E23\u0E2D\u0E2A\u0E31\u0E07\u0E2B\u0E32\u0E23\u0E34\u0E21\u0E17\u0E23\u0E31\u0E1E\u0E22\u0E4C\u0E41\u0E25\u0E30\u0E2D\u0E32\u0E04\u0E32\u0E23\u0E2A\u0E33\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E43\u0E08\u0E01\u0E25\u0E32\u0E07\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E\u0E2F" },
    { name: "Smart Delivery Thailand", type: "Logistics", prov: "\u0E19\u0E19\u0E17\u0E1A\u0E38\u0E23\u0E35", lat: 13.8425, lng: 100.5143, address: "15/6 \u0E16.\u0E07\u0E32\u0E21\u0E27\u0E07\u0E28\u0E4C\u0E27\u0E32\u0E19 \u0E15.\u0E1A\u0E32\u0E07\u0E40\u0E02\u0E19 \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07", allowance: 310, positions: "Data Analyst, Dispatch Operations Assistant", slots: 3, acc: false, meal: false, transport: true, desc: "\u0E41\u0E1E\u0E25\u0E15\u0E1F\u0E2D\u0E23\u0E4C\u0E21\u0E01\u0E32\u0E23\u0E02\u0E19\u0E2A\u0E48\u0E07\u0E41\u0E25\u0E30\u0E08\u0E31\u0E14\u0E2A\u0E48\u0E07\u0E1E\u0E31\u0E2A\u0E14\u0E38\u0E14\u0E48\u0E27\u0E19\u0E2D\u0E31\u0E08\u0E09\u0E23\u0E34\u0E22\u0E30\u0E17\u0E35\u0E48\u0E40\u0E15\u0E34\u0E1A\u0E42\u0E15\u0E40\u0E23\u0E47\u0E27\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19" },
    { name: "Cloud Commerce Solution", type: "IT", prov: "\u0E19\u0E19\u0E17\u0E1A\u0E38\u0E23\u0E35", lat: 13.9112, lng: 100.5015, address: "81 \u0E16.\u0E41\u0E08\u0E49\u0E07\u0E27\u0E31\u0E12\u0E19\u0E30 \u0E15.\u0E04\u0E25\u0E2D\u0E07\u0E40\u0E01\u0E25\u0E37\u0E2D \u0E2D.\u0E1B\u0E32\u0E01\u0E40\u0E01\u0E23\u0E47\u0E14", allowance: 500, positions: "Full Stack Developer, DevOps Intern, Business Analyst", slots: 4, acc: false, meal: false, transport: false, desc: "\u0E1C\u0E39\u0E49\u0E2A\u0E23\u0E23\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E23\u0E30\u0E1A\u0E1A E-commerce \u0E41\u0E1E\u0E25\u0E15\u0E1F\u0E2D\u0E23\u0E4C\u0E21\u0E41\u0E1A\u0E1A\u0E04\u0E23\u0E1A\u0E27\u0E07\u0E08\u0E23\u0E41\u0E25\u0E30\u0E42\u0E1B\u0E23\u0E41\u0E01\u0E23\u0E21 ERP \u0E1A\u0E19\u0E04\u0E25\u0E32\u0E27\u0E14\u0E4C" },
    { name: "Eastern Seaboard Electronics", type: "Manufacturing", prov: "\u0E0A\u0E25\u0E1A\u0E38\u0E23\u0E35", lat: 13.0905, lng: 101.0118, address: "119 \u0E15.\u0E1A\u0E48\u0E2D\u0E27\u0E34\u0E19 \u0E2D.\u0E28\u0E23\u0E35\u0E23\u0E32\u0E0A\u0E32", allowance: 400, positions: "Electronic Engineer Trainee, Quality Control Assistant", slots: 5, acc: true, meal: true, transport: true, desc: "\u0E42\u0E23\u0E07\u0E07\u0E32\u0E19\u0E1C\u0E25\u0E34\u0E15\u0E41\u0E1C\u0E48\u0E19\u0E27\u0E07\u0E08\u0E23\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E2D\u0E19\u0E34\u0E01\u0E2A\u0E4C\u0E41\u0E25\u0E30\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E04\u0E2D\u0E21\u0E1E\u0E34\u0E27\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E0A\u0E31\u0E49\u0E19\u0E19\u0E33\u0E2A\u0E48\u0E07\u0E15\u0E23\u0E07\u0E43\u0E2B\u0E49\u0E01\u0E31\u0E1A\u0E41\u0E1A\u0E23\u0E19\u0E14\u0E4C\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E19\u0E32\u0E19\u0E32\u0E0A\u0E32\u0E15\u0E34" },
    { name: "Phuket Luxury Cruise Services", type: "Service", prov: "\u0E20\u0E39\u0E40\u0E01\u0E47\u0E15", lat: 7.8245, lng: 98.4112, address: "9/9 \u0E17\u0E48\u0E32\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E40\u0E23\u0E37\u0E2D\u0E2D\u0E48\u0E32\u0E27\u0E09\u0E25\u0E2D\u0E07 \u0E15.\u0E09\u0E25\u0E2D\u0E07 \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07", allowance: 450, positions: "Tour Coordinator Trainee, Guest Relations Officer, Event Staff Intern", slots: 4, acc: false, meal: true, transport: true, desc: "\u0E43\u0E2B\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E40\u0E23\u0E37\u0E2D\u0E22\u0E2D\u0E17\u0E0A\u0E4C\u0E41\u0E25\u0E30\u0E2A\u0E31\u0E19\u0E17\u0E19\u0E32\u0E01\u0E32\u0E23\u0E17\u0E32\u0E07\u0E17\u0E30\u0E40\u0E25\u0E2A\u0E38\u0E14\u0E2B\u0E23\u0E39\u0E23\u0E2D\u0E1A\u0E2B\u0E21\u0E39\u0E48\u0E40\u0E01\u0E32\u0E30\u0E2D\u0E31\u0E19\u0E14\u0E32\u0E21\u0E31\u0E19" },
    { name: "Infinity Design & Architecture Studio", type: "Service", prov: "\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", lat: 18.7752, lng: 98.9881, address: "42 \u0E16.\u0E19\u0E34\u0E21\u0E21\u0E32\u0E19\u0E40\u0E2B\u0E21\u0E34\u0E19\u0E17\u0E4C \u0E15.\u0E2A\u0E38\u0E40\u0E17\u0E1E \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07", allowance: 250, positions: "Interior Designer Trainee, 3D Modeler Developer", slots: 3, acc: false, meal: false, transport: false, desc: "\u0E2A\u0E15\u0E39\u0E14\u0E34\u0E42\u0E2D\u0E2D\u0E2D\u0E01\u0E41\u0E1A\u0E1A\u0E20\u0E32\u0E22\u0E43\u0E19\u0E41\u0E25\u0E30\u0E2A\u0E16\u0E32\u0E1B\u0E31\u0E15\u0E22\u0E01\u0E23\u0E23\u0E21\u0E2A\u0E44\u0E15\u0E25\u0E4C\u0E42\u0E21\u0E40\u0E14\u0E34\u0E23\u0E4C\u0E19\u0E23\u0E48\u0E27\u0E21\u0E2A\u0E21\u0E31\u0E22" },
    { name: "Siam Cement Construction Enterprise", type: "Construction", prov: "\u0E2A\u0E23\u0E30\u0E1A\u0E38\u0E23\u0E35", lat: 14.5242, lng: 100.9124, address: "24 \u0E15.\u0E41\u0E01\u0E48\u0E07\u0E04\u0E2D\u0E22 \u0E2D.\u0E41\u0E01\u0E48\u0E07\u0E04\u0E2D\u0E22", allowance: 360, positions: "Civil Site Inspector, Safety Officer Assistant", slots: 5, acc: true, meal: true, transport: true, desc: "\u0E1C\u0E39\u0E49\u0E19\u0E33\u0E14\u0E49\u0E32\u0E19\u0E27\u0E31\u0E2A\u0E14\u0E38\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E2D\u0E38\u0E15\u0E2A\u0E32\u0E2B\u0E01\u0E23\u0E23\u0E21\u0E02\u0E19\u0E32\u0E14\u0E22\u0E31\u0E01\u0E29\u0E4C \u0E42\u0E14\u0E14\u0E40\u0E14\u0E48\u0E19\u0E14\u0E49\u0E32\u0E19\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E01\u0E32\u0E23\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E07\u0E32\u0E19\u0E08\u0E23\u0E34\u0E07\u0E1B\u0E25\u0E2D\u0E14\u0E20\u0E31\u0E22" },
    { name: "Neo Logistics & Express Way", type: "Logistics", prov: "\u0E02\u0E2D\u0E19\u0E41\u0E01\u0E48\u0E19", lat: 16.4251, lng: 102.8122, address: "81 \u0E16.\u0E23\u0E31\u0E0A\u0E21\u0E31\u0E07\u0E04\u0E25\u0E32\u0E20\u0E34\u0E40\u0E29\u0E01 \u0E15.\u0E28\u0E34\u0E25\u0E32 \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07", allowance: 300, positions: "Route Optimization Assistant, Logistics Analyst Trainee", slots: 3, acc: false, meal: true, transport: false, desc: "\u0E02\u0E22\u0E32\u0E22\u0E01\u0E32\u0E23\u0E08\u0E31\u0E14\u0E2A\u0E48\u0E07\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E01\u0E23\u0E30\u0E08\u0E32\u0E22\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E40\u0E02\u0E15\u0E20\u0E32\u0E04\u0E2D\u0E35\u0E2A\u0E32\u0E19\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E19\u0E1A\u0E49\u0E32\u0E19\u0E43\u0E01\u0E25\u0E49\u0E40\u0E04\u0E35\u0E22\u0E07" },
    { name: "DeepTech AI Lab Thailand", type: "IT", prov: "\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E\u0E21\u0E2B\u0E32\u0E19\u0E04\u0E23", lat: 13.7315, lng: 100.5298, address: "9 \u0E16.\u0E2D\u0E31\u0E07\u0E23\u0E35\u0E14\u0E39\u0E19\u0E31\u0E07\u0E15\u0E4C \u0E41\u0E02\u0E27\u0E07\u0E1B\u0E17\u0E38\u0E21\u0E27\u0E31\u0E19 \u0E40\u0E02\u0E15\u0E1B\u0E17\u0E38\u0E21\u0E27\u0E31\u0E19", allowance: 600, positions: "Machine Learning Intern, Data Engineer Trainee, Frontend React Developer", slots: 4, acc: false, meal: false, transport: true, desc: "\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E19\u0E27\u0E31\u0E15\u0E01\u0E23\u0E23\u0E21\u0E1B\u0E31\u0E0D\u0E0D\u0E32\u0E1B\u0E23\u0E30\u0E14\u0E34\u0E29\u0E10\u0E4C \u0E1E\u0E31\u0E12\u0E19\u0E32\u0E42\u0E0B\u0E25\u0E39\u0E0A\u0E31\u0E19\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C Big Data \u0E41\u0E14\u0E48\u0E2A\u0E16\u0E32\u0E1A\u0E31\u0E19\u0E01\u0E32\u0E23\u0E40\u0E07\u0E34\u0E19\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49" },
    { name: "Thai Craft Brewery & Beverage PLC", type: "Manufacturing", prov: "\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", lat: 18.8415, lng: 99.0121, address: "90 \u0E15.\u0E2B\u0E19\u0E2D\u0E07\u0E1B\u0E48\u0E32\u0E04\u0E23\u0E31\u0E48\u0E07 \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", allowance: 330, positions: "Chemical Process Intern, Food Safety Officer Trainee", slots: 4, acc: true, meal: true, transport: false, desc: "\u0E1C\u0E39\u0E49\u0E1C\u0E25\u0E34\u0E15\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E14\u0E37\u0E48\u0E21\u0E1E\u0E37\u0E49\u0E19\u0E1A\u0E49\u0E32\u0E19\u0E41\u0E25\u0E30\u0E2A\u0E21\u0E38\u0E19\u0E44\u0E1E\u0E23\u0E19\u0E27\u0E31\u0E15\u0E01\u0E23\u0E23\u0E21 \u0E15\u0E48\u0E2D\u0E22\u0E2D\u0E14\u0E04\u0E38\u0E13\u0E04\u0E48\u0E32\u0E17\u0E49\u0E2D\u0E07\u0E16\u0E34\u0E48\u0E19\u0E27\u0E34\u0E2A\u0E32\u0E2B\u0E01\u0E34\u0E08\u0E2A\u0E39\u0E48\u0E2A\u0E32\u0E22\u0E15\u0E32\u0E2A\u0E32\u0E01\u0E25" },
    { name: "Super Express Post (Thailand)", type: "Logistics", prov: "\u0E1B\u0E17\u0E38\u0E21\u0E18\u0E32\u0E19\u0E35", lat: 13.9851, lng: 100.6124, address: "19/3 \u0E16.\u0E1E\u0E2B\u0E25\u0E42\u0E22\u0E18\u0E34\u0E19 \u0E15.\u0E04\u0E25\u0E2D\u0E07\u0E2B\u0E19\u0E36\u0E48\u0E07 \u0E2D.\u0E04\u0E25\u0E2D\u0E07\u0E2B\u0E25\u0E27\u0E07", allowance: 320, positions: "Logistics Admin, Inventory Control Trainee", slots: 5, acc: false, meal: true, transport: true, desc: "\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E08\u0E31\u0E14\u0E2A\u0E48\u0E07\u0E1E\u0E31\u0E2A\u0E14\u0E38\u0E14\u0E48\u0E27\u0E19\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E0A\u0E32\u0E15\u0E34\u0E02\u0E19\u0E32\u0E14\u0E43\u0E2B\u0E0D\u0E48 \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E04\u0E31\u0E14\u0E41\u0E22\u0E01\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34\u0E17\u0E35\u0E48\u0E25\u0E49\u0E33\u0E2A\u0E21\u0E31\u0E22\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14" },
    { name: "Green Hotel & Sustainable Retreat", type: "Service", prov: "\u0E0A\u0E25\u0E1A\u0E38\u0E23\u0E35", lat: 12.9124, lng: 100.8715, address: "353 \u0E16.\u0E40\u0E02\u0E32\u0E1E\u0E23\u0E30\u0E15\u0E33\u0E2B\u0E19\u0E31\u0E01 \u0E15.\u0E2B\u0E19\u0E2D\u0E07\u0E1B\u0E23\u0E37\u0E2D \u0E2D.\u0E1A\u0E32\u0E07\u0E25\u0E30\u0E21\u0E38\u0E07", allowance: 350, positions: "Eco Tourism Assistant, Digital Event Coordinator Trainee", slots: 5, acc: true, meal: true, transport: true, desc: "\u0E01\u0E25\u0E38\u0E48\u0E21\u0E42\u0E23\u0E07\u0E41\u0E23\u0E21\u0E27\u0E34\u0E16\u0E35\u0E23\u0E31\u0E01\u0E29\u0E4C\u0E42\u0E25\u0E01\u0E17\u0E35\u0E48\u0E1E\u0E34\u0E08\u0E32\u0E23\u0E13\u0E32\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E2B\u0E22\u0E31\u0E14\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E1E\u0E31\u0E12\u0E19\u0E32\u0E0A\u0E38\u0E21\u0E0A\u0E19\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E22\u0E31\u0E48\u0E07\u0E22\u0E37\u0E19\u0E22\u0E2D\u0E14\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21" }
  ];
  const companies = companyTemplates.map((t, idx) => {
    const id = `COM${String(idx + 1).padStart(3, "0")}`;
    return {
      company_id: id,
      company_name: t.name,
      business_type: t.type,
      address: t.address,
      province: t.prov,
      district: "\u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07",
      latitude: t.lat,
      longitude: t.lng,
      contact_person: `\u0E04\u0E38\u0E13\u0E2A\u0E21\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C \u0E23\u0E31\u0E01\u0E44\u0E17\u0E22 (HR Manager)`,
      phone: `08${Math.floor(1e7 + Math.random() * 9e7)}`,
      email: `hr@${t.name.toLowerCase().replace(/[^a-z]/g, "") || "company"}.com`,
      allowance: t.allowance,
      accommodation: t.acc,
      meal_support: t.meal,
      transportation_support: t.transport,
      welfare_detail: t.desc.substring(0, 50) + " \u0E04\u0E48\u0E32\u0E19\u0E49\u0E33\u0E21\u0E31\u0E19 \u0E04\u0E48\u0E32\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07 \u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E01\u0E25\u0E32\u0E07\u0E27\u0E31\u0E19 \u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E2A\u0E31\u0E07\u0E04\u0E21",
      available_positions: t.positions,
      internship_slots: t.slots,
      company_description: t.desc,
      avg_rating: 0,
      review_count: 0,
      status: "Active"
    };
  });
  const firstNames = [
    "\u0E1E\u0E35\u0E23\u0E1E\u0E07\u0E29\u0E4C",
    "\u0E2D\u0E20\u0E34\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C",
    "\u0E13\u0E31\u0E10\u0E1E\u0E07\u0E29\u0E4C",
    "\u0E18\u0E19\u0E1E\u0E31\u0E12\u0E19\u0E4C",
    "\u0E28\u0E38\u0E20\u0E27\u0E34\u0E0A\u0E0D\u0E4C",
    "\u0E01\u0E34\u0E15\u0E15\u0E34\u0E1E\u0E07\u0E29\u0E4C",
    "\u0E2A\u0E23\u0E27\u0E34\u0E0A\u0E0D\u0E4C",
    "\u0E2A\u0E34\u0E23\u0E34\u0E20\u0E23\u0E13\u0E4C",
    "\u0E0A\u0E25\u0E25\u0E14\u0E32",
    "\u0E01\u0E21\u0E25\u0E27\u0E23\u0E23\u0E13",
    "\u0E1E\u0E31\u0E0A\u0E23\u0E32\u0E20\u0E32",
    "\u0E01\u0E32\u0E19\u0E15\u0E4C",
    "\u0E1B\u0E2D\u0E07\u0E20\u0E1E",
    "\u0E08\u0E34\u0E23\u0E27\u0E31\u0E12\u0E19\u0E4C",
    "\u0E18\u0E35\u0E23\u0E40\u0E28\u0E23\u0E29\u0E10\u0E4C",
    "\u0E2A\u0E23\u0E2D\u0E23\u0E23\u0E16",
    "\u0E18\u0E19\u0E32\u0E18\u0E34\u0E1B",
    "\u0E28\u0E23\u0E38\u0E15",
    "\u0E2A\u0E38\u0E23\u0E0A\u0E32\u0E15\u0E34",
    "\u0E27\u0E23\u0E27\u0E38\u0E12\u0E34",
    "\u0E1B\u0E23\u0E30\u0E27\u0E35\u0E13",
    "\u0E2D\u0E19\u0E31\u0E19\u0E15\u0E23\u0E32",
    "\u0E40\u0E1A\u0E0D\u0E08\u0E1E\u0E23",
    "\u0E27\u0E23\u0E23\u0E13\u0E34\u0E01\u0E32",
    "\u0E21\u0E31\u0E17\u0E19\u0E32",
    "\u0E0A\u0E0D\u0E32\u0E19\u0E34\u0E28",
    "\u0E27\u0E34\u0E23\u0E34\u0E19\u0E17\u0E23\u0E4C",
    "\u0E28\u0E38\u0E17\u0E18\u0E34\u0E19\u0E35",
    "\u0E23\u0E38\u0E48\u0E07\u0E2D\u0E23\u0E38\u0E13",
    "\u0E2D\u0E23\u0E14\u0E32",
    "\u0E1E\u0E34\u0E21\u0E25\u0E27\u0E23\u0E23\u0E13",
    "\u0E1E\u0E23\u0E23\u0E13\u0E23\u0E32\u0E22",
    "\u0E2D\u0E19\u0E31\u0E0D\u0E0D\u0E32",
    "\u0E01\u0E34\u0E15\u0E15\u0E34\u0E20\u0E1E",
    "\u0E19\u0E19\u0E17\u0E01\u0E23",
    "\u0E23\u0E31\u0E0A\u0E0A\u0E32\u0E19\u0E19\u0E17\u0E4C",
    "\u0E2D\u0E34\u0E17\u0E18\u0E34\u0E1E\u0E25",
    "\u0E08\u0E32\u0E23\u0E38\u0E27\u0E31\u0E12\u0E19\u0E4C",
    "\u0E40\u0E08\u0E29\u0E0E\u0E32\u0E01\u0E23",
    "\u0E1E\u0E07\u0E28\u0E18\u0E23",
    "\u0E19\u0E31\u0E19\u0E17\u0E34\u0E1E\u0E31\u0E12\u0E19\u0E4C",
    "\u0E0A\u0E25\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C",
    "\u0E01\u0E24\u0E29\u0E0E\u0E32",
    "\u0E08\u0E31\u0E01\u0E23\u0E34\u0E19\u0E17\u0E23\u0E4C",
    "\u0E1B\u0E34\u0E22\u0E1A\u0E38\u0E15\u0E23",
    "\u0E19\u0E34\u0E18\u0E34\u0E28",
    "\u0E01\u0E49\u0E2D\u0E07\u0E20\u0E1E",
    "\u0E19\u0E27\u0E1E\u0E25",
    "\u0E1B\u0E0F\u0E34\u0E1E\u0E25",
    "\u0E22\u0E28\u0E01\u0E23",
    "\u0E18\u0E31\u0E0D\u0E0D\u0E32\u0E23\u0E31\u0E15\u0E19\u0E4C",
    "\u0E1B\u0E23\u0E35\u0E22\u0E32\u0E20\u0E23\u0E13\u0E4C",
    "\u0E23\u0E38\u0E48\u0E07\u0E17\u0E34\u0E1E\u0E22\u0E4C",
    "\u0E2A\u0E34\u0E23\u0E34\u0E21\u0E32",
    "\u0E2A\u0E38\u0E17\u0E18\u0E34\u0E14\u0E32",
    "\u0E27\u0E31\u0E19\u0E27\u0E34\u0E2A\u0E32",
    "\u0E40\u0E1B\u0E21\u0E34\u0E01\u0E32",
    "\u0E08\u0E38\u0E11\u0E32\u0E21\u0E32\u0E28",
    "\u0E2A\u0E32\u0E27\u0E34\u0E15\u0E23\u0E35",
    "\u0E27\u0E34\u0E22\u0E14\u0E32"
  ];
  const lastNames = [
    "\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C",
    "\u0E14\u0E35\u0E40\u0E25\u0E34\u0E28",
    "\u0E23\u0E31\u0E01\u0E0A\u0E32\u0E15\u0E34",
    "\u0E01\u0E34\u0E15\u0E15\u0E34\u0E04\u0E38\u0E13",
    "\u0E1B\u0E23\u0E30\u0E40\u0E2A\u0E23\u0E34\u0E10\u0E14\u0E35",
    "\u0E40\u0E08\u0E23\u0E34\u0E0D\u0E27\u0E31\u0E12\u0E19\u0E32\u0E01\u0E38\u0E25",
    "\u0E2A\u0E34\u0E07\u0E2B\u0E23\u0E32\u0E0A",
    "\u0E2A\u0E27\u0E48\u0E32\u0E07\u0E27\u0E07\u0E29\u0E4C",
    "\u0E2A\u0E38\u0E02\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E34\u0E4C",
    "\u0E43\u0E08\u0E14\u0E35",
    "\u0E41\u0E01\u0E49\u0E27\u0E21\u0E13\u0E35",
    "\u0E20\u0E31\u0E01\u0E14\u0E35\u0E44\u0E17\u0E22",
    "\u0E1B\u0E31\u0E0D\u0E0D\u0E29\u0E14\u0E35",
    "\u0E1E\u0E25\u0E32\u0E18\u0E34\u0E1B",
    "\u0E23\u0E31\u0E15\u0E19\u0E30\u0E40\u0E14\u0E0A\u0E32",
    "\u0E28\u0E34\u0E23\u0E34\u0E17\u0E23\u0E31\u0E1E\u0E22\u0E4C",
    "\u0E18\u0E19\u0E40\u0E2A\u0E16\u0E35\u0E22\u0E23",
    "\u0E2A\u0E38\u0E27\u0E23\u0E23\u0E13\u0E0A\u0E31\u0E22",
    "\u0E0A\u0E48\u0E32\u0E07\u0E04\u0E34\u0E14",
    "\u0E2D\u0E34\u0E19\u0E17\u0E23\u0E2A\u0E21\u0E1A\u0E31\u0E15\u0E34",
    "\u0E19\u0E32\u0E23\u0E32\u0E23\u0E31\u0E15\u0E19\u0E4C",
    "\u0E40\u0E01\u0E35\u0E22\u0E23\u0E15\u0E34\u0E01\u0E38\u0E25",
    "\u0E2D\u0E38\u0E14\u0E21\u0E1C\u0E25",
    "\u0E1E\u0E39\u0E25\u0E40\u0E1E\u0E34\u0E48\u0E21",
    "\u0E41\u0E2A\u0E07\u0E17\u0E2D\u0E07",
    "\u0E27\u0E34\u0E08\u0E34\u0E15\u0E23",
    "\u0E21\u0E32\u0E19\u0E30\u0E14\u0E35",
    "\u0E21\u0E38\u0E48\u0E07\u0E21\u0E31\u0E48\u0E19",
    "\u0E23\u0E38\u0E48\u0E07\u0E40\u0E23\u0E37\u0E2D\u0E07",
    "\u0E0A\u0E25\u0E1B\u0E23\u0E30\u0E40\u0E2A\u0E23\u0E34\u0E10",
    "\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E40\u0E14\u0E0A",
    "\u0E40\u0E15\u0E0A\u0E30\u0E40\u0E08\u0E23\u0E34\u0E0D",
    "\u0E27\u0E07\u0E29\u0E4C\u0E2A\u0E38\u0E27\u0E23\u0E23\u0E13",
    "\u0E08\u0E07\u0E23\u0E31\u0E01\u0E44\u0E17\u0E22",
    "\u0E28\u0E23\u0E35\u0E2A\u0E38\u0E02",
    "\u0E18\u0E32\u0E14\u0E32\u0E01\u0E32\u0E23",
    "\u0E0A\u0E31\u0E22\u0E42\u0E22",
    "\u0E23\u0E2D\u0E14\u0E20\u0E31\u0E22",
    "\u0E2A\u0E38\u0E04\u0E19\u0E18\u0E23\u0E2A",
    "\u0E2A\u0E38\u0E02\u0E2A\u0E33\u0E23\u0E32\u0E0D"
  ];
  const majors = ["IT", "Computer Engineering", "Software Engineering", "Business Administration", "Logistics Management", "Mechanical Engineering", "Civil Engineering"];
  const faculties = {
    "IT": "\u0E40\u0E17\u0E04\u0E42\u0E19\u0E42\u0E25\u0E22\u0E35\u0E2A\u0E32\u0E23\u0E2A\u0E19\u0E40\u0E17\u0E28",
    "Computer Engineering": "\u0E27\u0E34\u0E28\u0E27\u0E01\u0E23\u0E23\u0E21\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C",
    "Software Engineering": "\u0E40\u0E17\u0E04\u0E42\u0E19\u0E42\u0E25\u0E22\u0E35\u0E2A\u0E32\u0E23\u0E2A\u0E19\u0E40\u0E17\u0E28",
    "Business Administration": "\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08",
    "Logistics Management": "\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08",
    "Mechanical Engineering": "\u0E27\u0E34\u0E28\u0E27\u0E01\u0E23\u0E23\u0E21\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C",
    "Civil Engineering": "\u0E27\u0E34\u0E28\u0E27\u0E01\u0E23\u0E23\u0E21\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C"
  };
  const students = [];
  const startId = 66010001;
  for (let i = 0; i < 100; i++) {
    const fIdx = Math.floor(Math.random() * firstNames.length);
    const lIdx = Math.floor(Math.random() * lastNames.length);
    const major = majors[Math.floor(Math.random() * majors.length)];
    const id = String(startId + i);
    const yearLevel = i % 2 === 0 ? 3 : 4;
    const edu = i % 10 === 0 ? "\u0E1B\u0E27\u0E2A" : "\u0E1B\u0E23\u0E34\u0E0D\u0E0D\u0E32\u0E15\u0E23\u0E35";
    students.push({
      student_id: id,
      first_name: firstNames[fIdx],
      last_name: lastNames[lIdx],
      major,
      faculty: faculties[major] || "\u0E27\u0E34\u0E28\u0E27\u0E01\u0E23\u0E23\u0E21\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C",
      education_level: edu,
      year_level: yearLevel,
      phone: `08${Math.floor(1e7 + Math.random() * 9e7)}`,
      email: `st.${id}@university.ac.th`,
      internship_year: 2025 + Math.floor(i / 35),
      // Distribute into 2025, 2026, 2027
      company_id: null,
      internship_status: "Planned"
    });
  }
  const internships = [];
  const reviews = [];
  let reviewIdCounter = 1;
  let internshipIdCounter = 1;
  for (let i = 0; i < 45; i++) {
    const student = students[i];
    const companyIndex = i % 15;
    const company = companies[companyIndex];
    student.company_id = company.company_id;
    if (i < 20) {
      student.internship_status = "Completed";
    } else if (i < 38) {
      student.internship_status = "Ongoing";
    } else {
      student.internship_status = "Planned";
    }
    const internYear = student.internship_year;
    const intern_id = `INT${String(internshipIdCounter++).padStart(4, "0")}`;
    internships.push({
      internship_id: intern_id,
      student_id: student.student_id,
      company_id: company.company_id,
      start_date: `${internYear}-06-01`,
      end_date: `${internYear}-10-31`,
      province: company.province,
      internship_year: internYear,
      status: student.internship_status
    });
    if (student.internship_status === "Completed") {
      const review_id = `REV${String(reviewIdCounter++).padStart(4, "0")}`;
      const suit = 3 + Math.floor(Math.random() * 3);
      const allow = company.allowance > 400 ? 5 : company.allowance > 300 ? 4 : 3;
      const welf = company.accommodation ? 5 : 3 + Math.floor(Math.random() * 3);
      const env = 3 + Math.floor(Math.random() * 3);
      const learn = 4 + Math.floor(Math.random() * 2);
      const avg = parseFloat(((suit + allow + welf + env + learn) / 5).toFixed(1));
      const comments = [
        "\u0E1E\u0E35\u0E48\u0E40\u0E25\u0E35\u0E49\u0E22\u0E07\u0E43\u0E2B\u0E49\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33\u0E2A\u0E2D\u0E19\u0E14\u0E35\u0E21\u0E32\u0E01\u0E46 \u0E15\u0E48\u0E2D\u0E22\u0E2D\u0E14\u0E04\u0E27\u0E32\u0E21\u0E23\u0E39\u0E49\u0E2A\u0E32\u0E22\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E08\u0E23\u0E34\u0E07\u0E44\u0E14\u0E49\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21 \u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E40\u0E1B\u0E47\u0E19\u0E01\u0E31\u0E19\u0E40\u0E2D\u0E07\u0E2A\u0E38\u0E14\u0E46",
        "\u0E41\u0E41\u0E19\u0E30\u0E19\u0E33\u0E17\u0E35\u0E48\u0E19\u0E35\u0E48\u0E40\u0E25\u0E22\u0E04\u0E23\u0E31\u0E1A \u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E34\u0E01\u0E32\u0E23\u0E14\u0E35\u0E21\u0E32\u0E01 \u0E21\u0E35\u0E2B\u0E2D\u0E1E\u0E31\u0E01\u0E41\u0E25\u0E30\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E01\u0E25\u0E32\u0E07\u0E27\u0E31\u0E19\u0E14\u0E39\u0E41\u0E25\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E14\u0E35 \u0E07\u0E32\u0E19\u0E44\u0E21\u0E48\u0E2B\u0E19\u0E31\u0E01\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B\u0E41\u0E25\u0E30\u0E44\u0E14\u0E49\u0E25\u0E07\u0E21\u0E37\u0E2D\u0E17\u0E33\u0E08\u0E23\u0E34\u0E07",
        "\u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\u0E43\u0E08\u0E04\u0E27\u0E32\u0E21\u0E43\u0E2A\u0E48\u0E43\u0E08\u0E02\u0E2D\u0E07\u0E17\u0E35\u0E21\u0E07\u0E32\u0E19 \u0E23\u0E27\u0E21\u0E16\u0E36\u0E07\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E17\u0E04\u0E42\u0E19\u0E42\u0E25\u0E22\u0E35\u0E17\u0E35\u0E48\u0E01\u0E49\u0E32\u0E27\u0E2B\u0E19\u0E49\u0E32 \u0E21\u0E35\u0E42\u0E2D\u0E01\u0E32\u0E2A\u0E23\u0E31\u0E1A\u0E1E\u0E34\u0E08\u0E32\u0E23\u0E13\u0E32\u0E40\u0E02\u0E49\u0E32\u0E17\u0E33\u0E07\u0E32\u0E19\u0E15\u0E48\u0E2D\u0E2B\u0E25\u0E31\u0E07\u0E1D\u0E36\u0E01\u0E08\u0E1A\u0E14\u0E49\u0E27\u0E22",
        "\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E14\u0E35\u0E21\u0E32\u0E01 \u0E44\u0E14\u0E49\u0E23\u0E48\u0E27\u0E21\u0E07\u0E32\u0E19\u0E41\u0E25\u0E30\u0E2A\u0E19\u0E17\u0E19\u0E32\u0E01\u0E31\u0E1A\u0E1E\u0E35\u0E48\u0E46 Developer \u0E17\u0E35\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E04\u0E38\u0E49\u0E19\u0E40\u0E04\u0E22\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E14\u0E35 \u0E2A\u0E49\u0E21\u0E15\u0E33\u0E27\u0E31\u0E19\u0E28\u0E38\u0E01\u0E23\u0E4C\u0E2D\u0E23\u0E48\u0E2D\u0E22!",
        "\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E30\u0E2A\u0E1A\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E01\u0E32\u0E23\u0E17\u0E33\u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E04\u0E38\u0E49\u0E21\u0E04\u0E48\u0E32 \u0E44\u0E14\u0E49\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E27\u0E34\u0E18\u0E35\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E1E\u0E37\u0E49\u0E19\u0E10\u0E32\u0E19\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E31\u0E14",
        "\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49\u0E07\u0E32\u0E19\u0E22\u0E2D\u0E14\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E21\u0E32\u0E01\u0E04\u0E23\u0E31\u0E1A \u0E21\u0E35\u0E02\u0E19\u0E21 \u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E14\u0E37\u0E48\u0E21 \u0E41\u0E25\u0E30\u0E02\u0E19\u0E21\u0E02\u0E1A\u0E40\u0E04\u0E35\u0E49\u0E22\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E14\u0E35 \u0E17\u0E33\u0E07\u0E32\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E23\u0E2D\u0E1A\u0E41\u0E25\u0E30\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E22\u0E37\u0E14\u0E2B\u0E22\u0E38\u0E48\u0E19",
        "\u0E1E\u0E35\u0E48\u0E46 \u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E43\u0E08\u0E14\u0E35\u0E04\u0E2D\u0E22\u0E14\u0E39\u0E41\u0E25\u0E0A\u0E48\u0E27\u0E22\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E15\u0E25\u0E2D\u0E14 \u0E41\u0E19\u0E30\u0E19\u0E33\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19 \u0E04\u0E2D\u0E22\u0E0A\u0E48\u0E27\u0E22\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E14\u0E39\u0E41\u0E25\u0E40\u0E1B\u0E47\u0E19\u0E01\u0E31\u0E25\u0E22\u0E32\u0E13\u0E21\u0E34\u0E15\u0E23"
      ];
      const comment = comments[i % comments.length];
      reviews.push({
        review_id,
        company_id: company.company_id,
        student_id: student.student_id,
        student_name: `${student.first_name} ${student.last_name}`,
        rating: avg,
        ratings: {
          job_suitability: suit,
          allowance: allow,
          welfare: welf,
          environment: env,
          learning: learn
        },
        comment,
        created_date: `${internYear}-11-05`
      });
    }
  }
  companies.forEach((comp) => {
    const compReviews = reviews.filter((r) => r.company_id === comp.company_id);
    if (compReviews.length > 0) {
      const sum = compReviews.reduce((acc, curr) => acc + curr.rating, 0);
      comp.avg_rating = parseFloat((sum / compReviews.length).toFixed(1));
      comp.review_count = compReviews.length;
    } else {
      const mockAvg = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
      comp.avg_rating = mockAvg;
      comp.review_count = 0;
    }
  });
  const logs = [
    { id: "LOG001", timestamp: new Date(Date.now() - 36e5 * 24 * 3).toISOString(), user_email: "m.donmuan@gmail.com", user_role: "Admin", action: "\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19\u0E40\u0E08\u0E40\u0E19\u0E2D\u0E40\u0E23\u0E15\u0E41\u0E25\u0E30\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E23\u0E30\u0E1A\u0E1A", details: "\u0E23\u0E30\u0E1A\u0E1A\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E2A\u0E21\u0E37\u0E2D\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19 20 \u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17, 100 \u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22" },
    { id: "LOG002", timestamp: new Date(Date.now() - 36e5 * 12).toISOString(), user_email: "m.donmuan@gmail.com", user_role: "Admin", action: "\u0E08\u0E31\u0E1A\u0E04\u0E39\u0E48\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32", details: "\u0E08\u0E31\u0E1A\u0E04\u0E39\u0E48\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E01\u0E31\u0E1A\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E17\u0E33\u0E07\u0E32\u0E19 45 \u0E23\u0E32\u0E22\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" }
  ];
  return {
    companies,
    students,
    internships,
    reviews,
    logs,
    sheetsUrl: ""
    // Google Sheets Apps Script integration url
  };
}
function getDb() {
  let db;
  if (import_fs.default.existsSync(DB_FILE)) {
    try {
      const data = import_fs.default.readFileSync(DB_FILE, "utf-8");
      db = JSON.parse(data);
    } catch (e) {
      console.error("Error reading database file, resetting...", e);
      db = generateSeedData();
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    }
  } else {
    db = generateSeedData();
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  }
  if (!db.majors || !Array.isArray(db.majors)) {
    db.majors = ["IT", "Computer Engineering", "Software Engineering", "Business Administration", "Logistics Management", "Mechanical Engineering", "Civil Engineering"];
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  }
  return db;
}
function writeDb(data) {
  import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}
function addLog(user_email, user_role, action, details) {
  const db = getDb();
  const newLog = {
    id: `LOG${String(Date.now()).slice(-6)}`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    user_email,
    user_role,
    action,
    details
  };
  db.logs.unshift(newLog);
  if (db.logs.length > 200) {
    db.logs = db.logs.slice(0, 200);
  }
  writeDb(db);
}
function calculateStats(db, selectedYear) {
  const companies = db.companies;
  let students = db.students;
  let internships = db.internships;
  if (selectedYear) {
    students = students.filter((s) => s.internship_year === selectedYear);
    internships = internships.filter((i) => i.internship_year === selectedYear);
  }
  const activeCompProvinces = new Set(
    companies.filter((c) => c.status === "Active").filter((c) => {
      if (selectedYear) {
        return internships.some((i) => i.company_id === c.company_id && i.status !== "Planned");
      }
      return true;
    }).map((c) => c.province)
  );
  const currentYearInterns = students.filter((s) => s.company_id !== null).length;
  let topRatedComp = "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25";
  let topRatedId = "";
  let topRating = 0;
  companies.forEach((c) => {
    let rFilter = db.reviews.filter((r) => r.company_id === c.company_id);
    if (selectedYear) {
      const yearStudentIds = students.map((s) => s.student_id);
      rFilter = rFilter.filter((r) => yearStudentIds.includes(r.student_id));
    }
    if (rFilter.length > 0) {
      const sum = rFilter.reduce((acc, curr) => acc + curr.rating, 0);
      const avg = parseFloat((sum / rFilter.length).toFixed(1));
      if (avg > topRating) {
        topRating = avg;
        topRatedComp = c.company_name;
        topRatedId = c.company_id;
      }
    } else if (!selectedYear && c.status === "Active" && c.avg_rating > topRating) {
      topRating = c.avg_rating;
      topRatedComp = c.company_name;
      topRatedId = c.company_id;
    }
  });
  const activeCompaniesCount = selectedYear ? new Set(students.filter((s) => s.company_id !== null).map((s) => s.company_id)).size : companies.length;
  return {
    totalCompanies: activeCompaniesCount,
    totalStudents: students.length,
    activeInternsCurrentYear: currentYearInterns,
    totalProvinces: activeCompProvinces.size,
    topRatedCompany: topRatedComp,
    topRatedCompanyId: topRatedId,
    topRating
  };
}
app.get("/api/stats", (req, res) => {
  const db = getDb();
  const yearQuery = req.query.year ? Number(req.query.year) : void 0;
  const stats = calculateStats(db, yearQuery);
  let studentsFiltered = db.students;
  let internshipsFiltered = db.internships;
  if (yearQuery) {
    studentsFiltered = db.students.filter((s) => s.internship_year === yearQuery);
    internshipsFiltered = db.internships.filter((i) => i.internship_year === yearQuery);
  }
  const yearMap = {};
  db.students.forEach((s) => {
    yearMap[s.internship_year] = (yearMap[s.internship_year] || 0) + 1;
  });
  const chartYear = Object.keys(yearMap).map((yr) => ({
    year_level: `\u0E1B\u0E35 ${yr} (\u0E1E.\u0E28. ${Number(yr) + 543})`,
    count: yearMap[Number(yr)]
  })).sort((a, b) => a.year_level.localeCompare(b.year_level));
  const provMap = {};
  internshipsFiltered.forEach((i) => {
    if (i.status !== "Planned" || i.province) {
      provMap[i.province || "\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38"] = (provMap[i.province || "\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38"] || 0) + 1;
    }
  });
  const chartProvince = Object.keys(provMap).map((prov) => ({
    province: prov,
    count: provMap[prov]
  })).sort((a, b) => b.count - a.count);
  const compStudentCount = {};
  db.companies.forEach((c) => {
    compStudentCount[c.company_id] = { name: c.company_name, count: 0 };
  });
  studentsFiltered.forEach((s) => {
    if (s.company_id && compStudentCount[s.company_id]) {
      compStudentCount[s.company_id].count++;
    }
  });
  const chartCompDistribution = Object.keys(compStudentCount).map((cid) => ({
    company_name: compStudentCount[cid].name.split("(")[0].trim(),
    count: compStudentCount[cid].count
  })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count).slice(0, 10);
  const typeMap = {};
  if (yearQuery) {
    const activeCompanyIdsThisYear = new Set(studentsFiltered.filter((s) => s.company_id !== null).map((s) => s.company_id));
    db.companies.forEach((c) => {
      if (activeCompanyIdsThisYear.has(c.company_id)) {
        typeMap[c.business_type] = (typeMap[c.business_type] || 0) + 1;
      }
    });
  } else {
    db.companies.forEach((c) => {
      typeMap[c.business_type] = (typeMap[c.business_type] || 0) + 1;
    });
  }
  const chartBusinessTypes = Object.keys(typeMap).map((type) => ({
    name: type,
    value: typeMap[type]
  }));
  const chartRatings = db.companies.map((c) => {
    let rFilter = db.reviews.filter((r) => r.company_id === c.company_id);
    if (yearQuery) {
      const studentIdsInYear = studentsFiltered.map((s) => s.student_id);
      rFilter = rFilter.filter((r) => studentIdsInYear.includes(r.student_id));
    }
    let avg = c.avg_rating;
    if (rFilter.length > 0) {
      const sum = rFilter.reduce((acc, curr) => acc + curr.rating, 0);
      avg = parseFloat((sum / rFilter.length).toFixed(1));
    } else if (yearQuery) {
      avg = 0;
    }
    return {
      company_name: c.company_name.split("(")[0].trim(),
      rating: avg,
      reviews: rFilter.length
    };
  }).filter((item) => item.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 20);
  const currentDate = /* @__PURE__ */ new Date("2026-05-25");
  const chartMonthlyPlacements = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const key = `${yr}-${mo}`;
    const thaiMonths = [
      "\u0E21.\u0E04.",
      "\u0E01.\u0E1E.",
      "\u0E21\u0E35.\u0E04.",
      "\u0E40\u0E21.\u0E22.",
      "\u0E1E.\u0E04.",
      "\u0E21\u0E34.\u0E22.",
      "\u0E01.\u0E04.",
      "\u0E2A.\u0E04.",
      "\u0E01.\u0E22.",
      "\u0E15.\u0E04.",
      "\u0E1E.\u0E22.",
      "\u0E18.\u0E04."
    ];
    const thYr = yr + 543;
    const yrShort = String(thYr).substring(2);
    const label = `${thaiMonths[d.getMonth()]} ${yrShort}`;
    chartMonthlyPlacements.push({
      key,
      month: label,
      count: 0
    });
  }
  internshipsFiltered.forEach((intern, index) => {
    if (intern.start_date) {
      let startKey = intern.start_date.substring(0, 7);
      if (startKey === "2025-06") {
        if (index % 7 === 1) startKey = "2025-07";
        else if (index % 7 === 2) startKey = "2025-08";
        else if (index % 7 === 3) startKey = "2025-10";
        else if (index % 7 === 4) startKey = "2025-11";
        else if (index % 7 === 5) startKey = "2026-01";
        else if (index % 7 === 6) startKey = "2026-03";
      }
      if (startKey === "2026-06") {
        if (index % 5 === 1) startKey = "2026-01";
        else if (index % 5 === 2) startKey = "2026-02";
        else if (index % 5 === 3) startKey = "2026-04";
        else if (index % 5 === 4) startKey = "2026-05";
      }
      const found = chartMonthlyPlacements.find((m) => m.key === startKey);
      if (found) {
        found.count++;
      }
    }
  });
  res.json({
    kpis: stats,
    chartYear,
    chartProvince,
    chartCompDistribution,
    chartBusinessTypes,
    chartRatings,
    chartMonthlyPlacements
  });
});
app.get("/api/companies", (req, res) => {
  const db = getDb();
  let list = db.companies;
  const { search, province, business_type, status, min_allowance, min_rating } = req.query;
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (c) => c.company_name.toLowerCase().includes(q) || c.available_positions.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)
    );
  }
  if (province) {
    list = list.filter((c) => c.province === String(province));
  }
  if (business_type) {
    list = list.filter((c) => c.business_type === String(business_type));
  }
  if (status) {
    list = list.filter((c) => c.status === String(status));
  }
  if (min_allowance) {
    list = list.filter((c) => c.allowance >= Number(min_allowance));
  }
  if (min_rating) {
    list = list.filter((c) => c.avg_rating >= Number(min_rating));
  }
  res.json(list);
});
app.post("/api/companies", (req, res) => {
  const db = getDb();
  const comp = req.body;
  if (!comp.company_name || !comp.business_type) {
    return res.status(400).json({ error: "\u0E01\u0E23\u0E38\u0E13\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08" });
  }
  const id = `COM${String(db.companies.length + 1).padStart(3, "0")}`;
  const newComp = {
    company_id: id,
    company_name: comp.company_name,
    business_type: comp.business_type,
    address: comp.address || "\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48",
    province: comp.province || "\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E\u0E21\u0E2B\u0E32\u0E19\u0E04\u0E23",
    district: comp.district || "\u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07",
    latitude: comp.latitude || 13.7563,
    longitude: comp.longitude || 100.5018,
    contact_person: comp.contact_person || "-",
    phone: comp.phone || "-",
    email: comp.email || "-",
    allowance: comp.allowance || 0,
    accommodation: comp.accommodation || false,
    meal_support: comp.meal_support || false,
    transportation_support: comp.transportation_support || false,
    welfare_detail: comp.welfare_detail || "-",
    available_positions: comp.available_positions || "\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B",
    internship_slots: comp.internship_slots || 1,
    company_description: comp.company_description || "",
    avg_rating: 0,
    review_count: 0,
    status: comp.status || "Active"
  };
  db.companies.push(newComp);
  writeDb(db);
  addLog(comp.email || "system@sims.cc", "Admin", "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19", `\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17 ${newComp.company_name} (ID: ${newComp.company_id}) \u0E1B\u0E23\u0E30\u0E2A\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08`);
  res.json(newComp);
});
app.put("/api/companies/:id", (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const idx = db.companies.findIndex((c) => c.company_id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17" });
  }
  const original = db.companies[idx];
  db.companies[idx] = { ...original, ...req.body, company_id: id };
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19", `\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14 ${db.companies[idx].company_name}`);
  res.json(db.companies[idx]);
});
app.delete("/api/companies/:id", (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const idx = db.companies.findIndex((c) => c.company_id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17" });
  }
  const deleted = db.companies.splice(idx, 1)[0];
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19", `\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17 ${deleted.company_name}`);
  res.json({ success: true, deletedCompanyId: id });
});
app.get("/api/students", (req, res) => {
  const db = getDb();
  let list = db.students;
  const { major, status, search, year } = req.query;
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (s) => s.student_id.toLowerCase().includes(q) || `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) || s.email && s.email.toLowerCase().includes(q)
    );
  }
  if (major) {
    list = list.filter((s) => s.major === String(major));
  }
  if (status) {
    list = list.filter((s) => s.internship_status === String(status));
  }
  if (year) {
    list = list.filter((s) => s.internship_year === Number(year));
  }
  res.json(list);
});
app.post("/api/students", (req, res) => {
  const db = getDb();
  const st = req.body;
  if (!st.student_id || !st.first_name || !st.last_name) {
    return res.status(400).json({ error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32 \u0E0A\u0E37\u0E48\u0E2D \u0E41\u0E25\u0E30\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25" });
  }
  if (db.students.some((s) => s.student_id === st.student_id)) {
    return res.status(400).json({ error: "\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E19\u0E35\u0E49\u0E21\u0E35\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E25\u0E49\u0E27" });
  }
  const newSt = {
    student_id: st.student_id,
    first_name: st.first_name,
    last_name: st.last_name,
    major: st.major || "IT",
    faculty: st.faculty || "\u0E40\u0E17\u0E04\u0E42\u0E19\u0E42\u0E25\u0E22\u0E35\u0E2A\u0E32\u0E23\u0E2A\u0E19\u0E40\u0E17\u0E28",
    education_level: st.education_level || "\u0E1B\u0E23\u0E34\u0E0D\u0E0D\u0E32\u0E15\u0E23\u0E35",
    year_level: st.year_level || 3,
    phone: st.phone || "-",
    email: st.email || `st.${st.student_id}@university.ac.th`,
    internship_year: st.internship_year || 2026,
    company_id: st.company_id || null,
    internship_status: st.internship_status || "Planned"
  };
  db.students.push(newSt);
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32", `\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32 ${newSt.first_name} ${newSt.last_name} (${newSt.student_id})`);
  res.json(newSt);
});
app.post("/api/students/import", (req, res) => {
  const db = getDb();
  const list = req.body.students;
  if (!list || !Array.isArray(list)) {
    return res.status(400).json({ error: "\u0E42\u0E1B\u0E23\u0E14\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E2D\u0E32\u0E23\u0E4C\u0E40\u0E23\u0E22\u0E4C\u0E17\u0E35\u0E48\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C" });
  }
  let addedCount = 0;
  let dupCount = 0;
  list.forEach((item) => {
    if (!item.student_id || !item.first_name || !item.last_name) return;
    const exists = db.students.some((s) => s.student_id === String(item.student_id));
    if (exists) {
      dupCount++;
      return;
    }
    db.students.push({
      student_id: String(item.student_id),
      first_name: item.first_name,
      last_name: item.last_name,
      major: item.major || "IT",
      faculty: item.faculty || "\u0E40\u0E17\u0E04\u0E42\u0E19\u0E42\u0E25\u0E22\u0E35\u0E2A\u0E32\u0E23\u0E2A\u0E19\u0E40\u0E17\u0E28",
      education_level: item.education_level === "\u0E1B\u0E27\u0E2A" ? "\u0E1B\u0E27\u0E2A" : "\u0E1B\u0E23\u0E34\u0E0D\u0E0D\u0E32\u0E15\u0E23\u0E35",
      year_level: Number(item.year_level) || 3,
      phone: item.phone || "-",
      email: item.email || `st.${item.student_id}@university.ac.th`,
      internship_year: Number(item.internship_year) || 2026,
      company_id: item.company_id || null,
      internship_status: item.internship_status || "Planned"
    });
    addedCount++;
  });
  if (addedCount > 0) {
    writeDb(db);
    addLog("admin@sims.com", "Admin", "\u0E19\u0E33\u0E40\u0E02\u0E49\u0E32\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E41\u0E1A\u0E1A\u0E01\u0E25\u0E38\u0E48\u0E21", `\u0E19\u0E33\u0E40\u0E02\u0E49\u0E32\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E43\u0E2B\u0E21\u0E48 ${addedCount} \u0E23\u0E32\u0E22 \u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 (\u0E0B\u0E49\u0E33 ${dupCount} \u0E23\u0E32\u0E22)`);
  }
  res.json({ success: true, added: addedCount, duplicated: dupCount });
});
app.put("/api/students/:id", (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const idx = db.students.findIndex((s) => s.student_id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32" });
  }
  const original = db.students[idx];
  db.students[idx] = { ...original, ...req.body, student_id: id };
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32", `\u0E41\u0E01\u0E49\u0E44\u0E02\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32 ${db.students[idx].first_name} (${id})`);
  res.json(db.students[idx]);
});
app.delete("/api/students/:id", (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const idx = db.students.findIndex((s) => s.student_id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32" });
  }
  const deleted = db.students.splice(idx, 1)[0];
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32", `\u0E25\u0E1A\u0E41\u0E1F\u0E49\u0E21\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32 ${deleted.first_name} ${deleted.last_name}`);
  res.json({ success: true, deletedStudentId: id });
});
app.get("/api/internships", (req, res) => {
  const db = getDb();
  res.json(db.internships);
});
app.post("/api/internships/assign", (req, res) => {
  const db = getDb();
  const { student_id, company_id, start_date, end_date } = req.body;
  if (!student_id || !company_id) {
    return res.status(400).json({ error: "\u0E42\u0E1B\u0E23\u0E14\u0E23\u0E30\u0E1A\u0E38\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E41\u0E25\u0E30\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E17\u0E35\u0E48\u0E08\u0E30\u0E08\u0E31\u0E14\u0E2A\u0E23\u0E23" });
  }
  const stIdx = db.students.findIndex((s) => s.student_id === student_id);
  const cp = db.companies.find((c) => c.company_id === company_id);
  if (stIdx === -1 || !cp) {
    return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E2B\u0E31\u0E2A\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E01\u0E23\u0E2D\u0E01\u0E25\u0E07\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A" });
  }
  const student = db.students[stIdx];
  const alreadyAssigned = db.students.filter((s) => s.company_id === company_id && s.internship_status !== "Completed").length;
  if (alreadyAssigned >= cp.internship_slots) {
    console.log(`Warning: Slots filled for ${cp.company_name} (${alreadyAssigned}/${cp.internship_slots})`);
  }
  student.company_id = company_id;
  student.internship_status = "Ongoing";
  db.internships = db.internships.filter((i) => i.student_id !== student_id || i.status === "Completed");
  const internId = `INT${String(db.internships.length + 1).padStart(4, "0")}`;
  const newInternship = {
    internship_id: internId,
    student_id,
    company_id,
    start_date: start_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    end_date: end_date || new Date(Date.now() + 36e5 * 24 * 120).toISOString().split("T")[0],
    // 4 months default
    province: cp.province,
    internship_year: student.internship_year,
    status: "Ongoing"
  };
  db.internships.push(newInternship);
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E08\u0E31\u0E1A\u0E04\u0E39\u0E48\u0E08\u0E31\u0E1A\u0E01\u0E25\u0E38\u0E48\u0E21\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19", `\u0E08\u0E31\u0E14\u0E2A\u0E23\u0E23\u0E04\u0E38\u0E13 ${student.first_name} \u0E43\u0E2B\u0E49\u0E1D\u0E36\u0E01\u0E1D\u0E19\u0E17\u0E35\u0E48 ${cp.company_name}`);
  res.json({ success: true, student, internship: newInternship });
});
app.put("/api/internships/update-status", (req, res) => {
  const db = getDb();
  const { student_id, status } = req.body;
  if (!student_id || !status) {
    return res.status(400).json({ error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E41\u0E25\u0E30\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E43\u0E2B\u0E21\u0E48" });
  }
  const stIdx = db.students.findIndex((s) => s.student_id === student_id);
  if (stIdx === -1) {
    return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32" });
  }
  const originalStatus = db.students[stIdx].internship_status;
  db.students[stIdx].internship_status = status;
  const internIdx = db.internships.findIndex((i) => i.student_id === student_id && i.status !== "Completed");
  if (internIdx !== -1) {
    db.internships[internIdx].status = status;
  }
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19", `\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E04\u0E38\u0E13 ${db.students[stIdx].first_name} \u0E40\u0E1B\u0E47\u0E19 [${status}] (\u0E40\u0E14\u0E34\u0E21: ${originalStatus})`);
  res.json(db.students[stIdx]);
});
app.get("/api/reviews", (req, res) => {
  const db = getDb();
  res.json(db.reviews);
});
app.post("/api/reviews", (req, res) => {
  const db = getDb();
  const { company_id, student_id, rating, ratings, comment } = req.body;
  if (!company_id || !student_id || !ratings) {
    return res.status(400).json({ error: "\u0E1B\u0E49\u0E2D\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E41\u0E25\u0E30\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E23\u0E35\u0E27\u0E34\u0E27\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E16\u0E49\u0E27\u0E19" });
  }
  const student = db.students.find((s) => s.student_id === student_id);
  if (!student) {
    return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E2B\u0E31\u0E2A\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E19\u0E35\u0E49\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A" });
  }
  const { job_suitability, allowance, welfare, environment, learning } = ratings;
  const avg = parseFloat(((job_suitability + allowance + welfare + environment + learning) / 5).toFixed(1));
  const review_id = `REV${String(db.reviews.length + 1).padStart(4, "0")}`;
  const newReview = {
    review_id,
    company_id,
    student_id,
    student_name: `${student.first_name} ${student.last_name}`,
    rating: avg,
    ratings: {
      job_suitability: Number(job_suitability),
      allowance: Number(allowance),
      welfare: Number(welfare),
      environment: Number(environment),
      learning: Number(learning)
    },
    comment: comment || "",
    created_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  db.reviews.push(newReview);
  const targetCompIdx = db.companies.findIndex((c) => c.company_id === company_id);
  if (targetCompIdx !== -1) {
    const comp = db.companies[targetCompIdx];
    const compReviews = db.reviews.filter((r) => r.company_id === company_id);
    const sum = compReviews.reduce((acc, curr) => acc + curr.rating, 0);
    comp.avg_rating = parseFloat((sum / compReviews.length).toFixed(1));
    comp.review_count = compReviews.length;
  }
  writeDb(db);
  addLog(student.email, "Student", "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E23\u0E35\u0E27\u0E34\u0E27\u0E2A\u0E16\u0E32\u0E19\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A\u0E01\u0E32\u0E23", `\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32 ${student.first_name} \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E23\u0E35\u0E27\u0E34\u0E27\u0E04\u0E30\u0E41\u0E19\u0E19\u0E40\u0E09\u0E25\u0E35\u0E48\u0E22 ${avg} \u0E14\u0E32\u0E27 \u0E41\u0E01\u0E48\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17 ID: ${company_id}`);
  res.json(newReview);
});
app.get("/api/logs", (req, res) => {
  const db = getDb();
  res.json(db.logs || []);
});
app.get("/api/sheets-config", (req, res) => {
  const db = getDb();
  res.json({ sheetsUrl: db.sheetsUrl || "" });
});
app.post("/api/sheets-config", (req, res) => {
  const db = getDb();
  const { sheetsUrl } = req.body;
  db.sheetsUrl = sheetsUrl || "";
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E2A\u0E32\u0E22\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E42\u0E22\u0E07 Google Sheet", sheetsUrl ? `\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15 Google Apps Script API URL: ${sheetsUrl.substring(0, 40)}...` : "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E01\u0E31\u0E1A Google Sheet");
  res.json({ success: true, sheetsUrl: db.sheetsUrl });
});
app.get("/api/majors", (req, res) => {
  const db = getDb();
  res.json(db.majors || []);
});
app.post("/api/majors", (req, res) => {
  const db = getDb();
  const { name } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32" });
  }
  const cleanName = name.trim();
  db.majors = db.majors || [];
  if (db.majors.includes(cleanName)) {
    return res.status(400).json({ error: "\u0E21\u0E35\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32\u0E19\u0E35\u0E49\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27" });
  }
  db.majors.push(cleanName);
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32\u0E40\u0E2D\u0E01\u0E43\u0E2B\u0E21\u0E48", `\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E01\u0E25\u0E38\u0E48\u0E21\u0E2A\u0E32\u0E02\u0E32 ${cleanName} \u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22`);
  res.json({ success: true, majors: db.majors });
});
app.put("/api/majors", (req, res) => {
  const db = getDb();
  const { oldName, newName } = req.body;
  if (!oldName || !newName || typeof oldName !== "string" || typeof newName !== "string" || !newName.trim()) {
    return res.status(400).json({ error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E14\u0E34\u0E21\u0E41\u0E25\u0E30\u0E0A\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E21\u0E48" });
  }
  const cleanOld = oldName.trim();
  const cleanNew = newName.trim();
  db.majors = db.majors || [];
  const idx = db.majors.indexOf(cleanOld);
  if (idx === -1) {
    return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32\u0E40\u0E14\u0E34\u0E21\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A" });
  }
  if (db.majors.includes(cleanNew) && cleanOld !== cleanNew) {
    return res.status(400).json({ error: "\u0E21\u0E35\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32\u0E43\u0E2B\u0E21\u0E48\u0E19\u0E35\u0E49\u0E04\u0E39\u0E48\u0E02\u0E19\u0E32\u0E19\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E25\u0E49\u0E27" });
  }
  db.majors[idx] = cleanNew;
  let updatedCount = 0;
  if (db.students && Array.isArray(db.students)) {
    db.students.forEach((s) => {
      if (s.major === cleanOld) {
        s.major = cleanNew;
        updatedCount++;
      }
    });
  }
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32", `\u0E41\u0E01\u0E49\u0E44\u0E02\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32 ${cleanOld} \u0E40\u0E1B\u0E47\u0E19 ${cleanNew} (\u0E2A\u0E48\u0E07\u0E1C\u0E25\u0E15\u0E48\u0E2D\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32 ${updatedCount} \u0E23\u0E32\u0E22)`);
  res.json({ success: true, majors: db.majors, updatedCount });
});
app.delete("/api/majors", (req, res) => {
  const db = getDb();
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A" });
  }
  const cleanName = name.trim();
  db.majors = db.majors || [];
  const idx = db.majors.indexOf(cleanName);
  if (idx === -1) {
    return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A" });
  }
  db.majors.splice(idx, 1);
  writeDb(db);
  addLog("admin@sims.com", "Admin", "\u0E25\u0E1A\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E23\u0E30\u0E1A\u0E1A", `\u0E16\u0E2D\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E32\u0E02\u0E32 ${cleanName}`);
  res.json({ success: true, majors: db.majors });
});
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("\u0E23\u0E30\u0E1A\u0E1A\u0E15\u0E23\u0E27\u0E08\u0E44\u0E21\u0E48\u0E1E\u0E1A API Key \u0E43\u0E19\u0E2A\u0E31\u0E1B\u0E14\u0E32\u0E2B\u0E4C\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 (\u0E01\u0E23\u0E38\u0E13\u0E32\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E04\u0E35\u0E22\u0E4C GEMINI_API_KEY \u0E43\u0E19 Settings)");
    }
    aiClient = new import_genai.GoogleGenAI({ apiKey });
  }
  return aiClient;
}
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { type, companyId, studentId, promptText } = req.body;
    const db = getDb();
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: "\u0E42\u0E1B\u0E23\u0E14\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07 GEMINI_API_KEY \u0E43\u0E19\u0E15\u0E31\u0E27\u0E0A\u0E48\u0E27\u0E22\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E48\u0E2D\u0E19\u0E43\u0E0A\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E14\u0E49\u0E27\u0E22 AI" });
    }
    const client = getGeminiClient();
    let prompt = "";
    if (type === "company-report" && companyId) {
      const company = db.companies.find((c) => c.company_id === companyId);
      const reviews = db.reviews.filter((r) => r.company_id === companyId);
      if (!company) return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E19\u0E35\u0E49" });
      const reviewTexts = reviews.map((r) => `- \u0E04\u0E30\u0E41\u0E19\u0E19\u0E40\u0E09\u0E25\u0E35\u0E48\u0E22: ${r.rating}/5 \u0E14\u0E32\u0E27 \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E22\u0E48\u0E2D: "${r.comment}" (\u0E07\u0E32\u0E19:${r.ratings.job_suitability}, \u0E04\u0E48\u0E32\u0E15\u0E2D\u0E1A\u0E41\u0E17\u0E19:${r.ratings.allowance}, \u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E34\u0E01\u0E32\u0E23:${r.ratings.welfare}, \u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28:${r.ratings.environment}, \u0E01\u0E32\u0E23\u0E40\u0E23\u0E35\u0E22\u0E19\u0E23\u0E39\u0E49:${r.ratings.learning})`).join("\n");
      prompt = `\u0E04\u0E38\u0E13\u0E04\u0E37\u0E2D\u0E1C\u0E39\u0E49\u0E40\u0E0A\u0E35\u0E48\u0E22\u0E27\u0E0A\u0E32\u0E0D\u0E14\u0E49\u0E32\u0E19\u0E41\u0E19\u0E30\u0E41\u0E19\u0E27\u0E2D\u0E32\u0E0A\u0E35\u0E1E\u0E41\u0E25\u0E30\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E2A\u0E16\u0E34\u0E15\u0E34\u0E2A\u0E16\u0E32\u0E19\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A\u0E01\u0E32\u0E23\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19 \u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E04\u0E37\u0E2D\u0E43\u0E2B\u0E49\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E2A\u0E23\u0E38\u0E1B\u0E2A\u0E1B\u0E35\u0E14\u0E41\u0E1A\u0E47\u0E04\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E08\u0E38\u0E14\u0E40\u0E14\u0E48\u0E19\u0E41\u0E25\u0E30\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E23\u0E1E\u0E31\u0E12\u0E19\u0E32\u0E02\u0E2D\u0E07\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E19\u0E35\u0E49\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E23\u0E2D\u0E1A\u0E14\u0E49\u0E32\u0E19 3 \u0E22\u0E48\u0E2D\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E31\u0E49\u0E19\u0E43\u0E19\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E20\u0E32\u0E1E
\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17: ${company.company_name}
\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08: ${company.business_type}
\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E1B\u0E23\u0E30\u0E42\u0E22\u0E0A\u0E19\u0E4C: \u0E04\u0E48\u0E32\u0E15\u0E2D\u0E1A\u0E41\u0E17\u0E19\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E27\u0E31\u0E19 ${company.allowance} \u0E1A\u0E32\u0E17, \u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E34\u0E01\u0E32\u0E23\u0E17\u0E35\u0E48\u0E1E\u0E31\u0E01=${company.accommodation ? "\u0E21\u0E35" : "\u0E44\u0E21\u0E48\u0E21\u0E35"}, \u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E34\u0E01\u0E32\u0E23\u0E2D\u0E32\u0E2B\u0E32\u0E23=${company.meal_support ? "\u0E21\u0E35" : "\u0E44\u0E21\u0E48\u0E21\u0E35"}, \u0E23\u0E16\u0E23\u0E31\u0E1A\u0E2A\u0E48\u0E07=${company.transportation_support ? "\u0E21\u0E35" : "\u0E44\u0E21\u0E48\u0E21\u0E35"}
\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19\u0E41\u0E25\u0E30\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E23\u0E35\u0E27\u0E34\u0E27\u0E2A\u0E30\u0E2A\u0E30\u0E2A\u0E21\u0E42\u0E14\u0E22\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19:
${reviewTexts || "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32\u0E23\u0E35\u0E27\u0E34\u0E27\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21"}
\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E02\u0E35\u0E22\u0E19\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E41\u0E1A\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E07\u0E48\u0E32\u0E22\u0E41\u0E25\u0E30\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E40\u0E17\u0E47\u0E08\u0E08\u0E23\u0E34\u0E07`;
    } else if (type === "student-match" && studentId) {
      const student = db.students.find((s) => s.student_id === studentId);
      if (!student) return res.status(404).json({ error: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32" });
      const availableActiveCompanies = db.companies.filter((c) => c.status === "Active").slice(0, 10);
      const companyDetails = availableActiveCompanies.map((c) => `- ${c.company_name} (ID: ${c.company_id}) | \u0E18\u0E38\u0E23\u0E01\u0E34\u0E08: ${c.business_type} | \u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E15\u0E49\u0E19: "${c.company_description}" | \u0E15\u0E4D\u0E32\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E23\u0E31\u0E1A: "${c.available_positions}" | \u0E04\u0E48\u0E32\u0E40\u0E1A\u0E35\u0E49\u0E22\u0E40\u0E25\u0E35\u0E49\u0E22\u0E07\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19: ${c.allowance} \u0E1A\u0E32\u0E17`).join("\n");
      prompt = `\u0E04\u0E38\u0E13\u0E04\u0E37\u0E2D\u0E23\u0E30\u0E1A\u0E1A\u0E2D\u0E31\u0E08\u0E09\u0E23\u0E34\u0E22\u0E30\u0E41\u0E19\u0E30\u0E19\u0E33\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19 \u0E0A\u0E48\u0E27\u0E22\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E2B\u0E32\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14 3 \u0E41\u0E2B\u0E48\u0E07\u0E08\u0E32\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 \u0E42\u0E14\u0E22\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E08\u0E32\u0E01\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32\u0E40\u0E2D\u0E01 \u0E04\u0E27\u0E32\u0E21\u0E0A\u0E2D\u0E1A \u0E41\u0E25\u0E30\u0E04\u0E38\u0E13\u0E2A\u0E21\u0E1A\u0E31\u0E15\u0E34\u0E02\u0E2D\u0E07\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32
\u0E19\u0E31\u0E01\u0E28\u0E36\u0E01\u0E29\u0E32: \u0E04\u0E38\u0E13 ${student.first_name} ${student.last_name}
\u0E2A\u0E32\u0E02\u0E32\u0E27\u0E34\u0E0A\u0E32: ${student.major} (\u0E04\u0E13\u0E30: ${student.faculty})
\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E28\u0E36\u0E01\u0E29\u0E32: ${student.education_level} \u0E0A\u0E31\u0E49\u0E19\u0E1B\u0E35: ${student.year_level}

\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19\u0E40\u0E1B\u0E34\u0E14\u0E23\u0E31\u0E1A\u0E2A\u0E21\u0E31\u0E04\u0E23:
${companyDetails}

\u0E01\u0E23\u0E38\u0E13\u0E32\u0E41\u0E19\u0E30\u0E19\u0E33 3 \u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17\u0E40\u0E23\u0E35\u0E22\u0E07\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E23\u0E30\u0E1A\u0E38\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25\u0E0B\u0E31\u0E1E\u0E1E\u0E2D\u0E23\u0E4C\u0E15\u0E01\u0E32\u0E23\u0E15\u0E31\u0E14\u0E2A\u0E34\u0E19\u0E43\u0E08\u0E41\u0E15\u0E48\u0E25\u0E30\u0E41\u0E2B\u0E48\u0E07 \u0E2A\u0E23\u0E38\u0E1B\u0E2A\u0E31\u0E49\u0E19\u0E46 \u0E40\u0E1B\u0E47\u0E19\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22\u0E19\u0E48\u0E32\u0E2D\u0E48\u0E32\u0E19`;
    } else {
      prompt = promptText || "\u0E15\u0E2D\u0E1A\u0E17\u0E31\u0E01\u0E17\u0E32\u0E22\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E41\u0E25\u0E30\u0E41\u0E08\u0E49\u0E07\u0E27\u0E48\u0E32\u0E04\u0E38\u0E13\u0E04\u0E37\u0E2D\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E19\u0E30\u0E19\u0E33\u0E2D\u0E31\u0E08\u0E09\u0E23\u0E34\u0E22\u0E30 AI Assistant \u0E02\u0E2D\u0E07\u0E23\u0E30\u0E1A\u0E1A\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E1D\u0E36\u0E01\u0E07\u0E32\u0E19 Student Internship Management System (SIMS)";
    }
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    res.json({ text: response.text });
  } catch (err) {
    console.error("Gemini AI API Error:", err);
    res.status(500).json({ error: err.message || "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25\u0E14\u0E49\u0E27\u0E22 Gemini AI" });
  }
});
async function startServer() {
  const pEnv = process.env.NODE_ENV || "development";
  console.log(`Starting SIMS Backend Server in [${pEnv}] mode...`);
  getDb();
  if (pEnv !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SIMS Server is now listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
