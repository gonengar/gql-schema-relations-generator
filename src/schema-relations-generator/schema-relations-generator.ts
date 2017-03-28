import {getNamedType} from 'graphql';

const IRRELEVANT_TYPES = ['String', 'Boolean', 'Int', 'Float', 'Query', 'Mutation', 'Subscription'];
const isIrrelevantType = (typeName: string) => IRRELEVANT_TYPES.indexOf(typeName) != -1 || typeName.substr(0, 2) == '__';

const checkType = (type, typeName, typesArray, rootName, containDescription) => {
    if (type.type) {
        if (getNamedType(type.type).name === typeName && (!containDescription || type.description !== "" && type.description !== undefined)) {
            //ToDo: Take care of description. maybe a callback
            let typeProps = containDescription ?  {rootName: rootName, description: type.description} : {rootName: rootName};
            typesArray.add(typeProps);

            return;
        }
    }

    if (type._fields){
        let fieldNames = Object.keys(type._fields);

        for (let fieldName of fieldNames){
            let fieldValue = type._fields[fieldName];
            if (!typesArray.has(fieldValue.type.name)){
                checkType(fieldValue, typeName, typesArray, rootName, containDescription);
            }
        }
    }
};

export class SchemaRelationsGenerator {
    private relationsMap: Map<string, Set<any>>;

    constructor(){
        this.relationsMap = new Map<string, Set<any>>();
    }

    generateRelationsMap(schema, containDescription = false){
        let typeMap = schema.getTypeMap();
        let typeNames = Object.keys(typeMap);

        for (let typeNameToSearch of typeNames){
            if (!isIrrelevantType(typeNameToSearch)){
                let containingTypes = new Set();

                for (let typeName of typeNames){
                    if (!isIrrelevantType(typeName)){
                        checkType(typeMap[typeName], typeNameToSearch, containingTypes, typeName, containDescription)
                    }

                    if (containingTypes.size > 0){
                        this.relationsMap.set(typeNameToSearch, containingTypes);
                    }
                }
            }
        }
    }

    getRelationsMap(){
        return this.relationsMap;
    }

    getContainingTypes(type):Set<any>{
        return this.relationsMap.get(type) || new Set();
    }
}