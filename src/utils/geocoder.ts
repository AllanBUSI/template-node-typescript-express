// import { errorLogger } from "@config/winston";
// import axios from "axios";
// import databaseManager from "../database";

// export const geocode = a => {
//   return a;
// };

// export const getCoordinates = async (address: string): Promise<false | number[]> => {
//   try {
//     const { data } = await axios.get("https://api-adresse.data.gouv.fr/search", {
//       params: {
//         limit: 15,
//         autocomplete: 0,
//         q: address,
//       },
//     });
//     return data.features[0]?.geometry.coordinates;
//   } catch (error) {
//     errorLogger.error(`${error.status || 500} - [src/utils/geocoder ()=> getCoordinates] - ${error.message}`);
//     console.log("error: ", error);
//     return false;
//   }
// };

// export const cityInfo = async params => {
//   var config: object = {
//     method: "get",
//     url:
//       "https://geo.api.gouv.fr/communes?nom=" +
//       params +
//       "&fields=code,nom,population,contour,departement,codeDepartement,codeRegion,region,centre,surface,codesPostaux",
//   };
//   const ville = await axios(config);
//   return ville.data;
// };

// export const villeCodePostal = async (city: string, postal_code: string) => {
//   const db = await databaseManager.getManager();
//   // const ville = Boolean(city) ? city.replace(/-/g, "%").replace(/ /g, "%").replace(/'/g, "%") : "%";

//   // const villeFrance = await db
//   //   .getRepository(VillesFrance)
//   //   .createQueryBuilder("data")
//   //   .select(["data.villeId", "data.villeNomReel", "data.villeCodePostal"])
//   //   .where("data.villeNomReel LIKE :ville", { ville })
//   //   .andWhere("data.villeCodePostal LIKE :cp", { cp: `%${postal_code}%` })
//   //   .limit(10)
//   //   .orderBy("data.villeNomReel", "ASC")
//   //   .getMany();

//   return villeFrance;
// };
