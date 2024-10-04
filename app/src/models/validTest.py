import z3
import sys
import enum
import json

class ObjectType(enum.Enum):
    PlanetX=1
    Dwarf=2
    Comet=3
    Asteroid=4
    GasCloud=5
    Empty=6

ObjectTypeCountStandard: dict[ObjectType, int] = {
    ObjectType.PlanetX:1,
    ObjectType.Dwarf:1,
    ObjectType.Comet:2,
    ObjectType.Asteroid:4,
    ObjectType.GasCloud: 2,
    ObjectType.Empty:2
}

def is_prime(num: int):
    return num in (2, 3, 5, 7, 11, 13, 17)

def constraints(range_len, obj1, obj2):
    s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12=z3.Ints('s1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 s12')
    celestial = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12]
    result=[]
    def left_sector(sector: int):
        return (sector+12-1)%12
        
    def right_sector(sector: int):
        return (sector+1)%12

    def res_range(sector: int):
        result: list[int]=[]
        for i in range(sector):
            result.append(celestial[left_sector(sector-i)])
            result.append(celestial[right_sector(sector+i)])
        return result

    #count of each object should be certain value
    for obj in ObjectType:
        result.append(sum(z3.If(i == obj.value, 1, 0) for i in celestial) == ObjectTypeCountStandard[obj])
        
        
    for i in range(12):
        result.append(z3.Implies(
            celestial[i]==ObjectType.Comet.value,
            is_prime(i+1)
        ))
        
        result.append(z3.Implies(
            celestial[i]==ObjectType.Asteroid.value,
            z3.Or(celestial[left_sector(i)]==ObjectType.Asteroid.value, celestial[right_sector(i)]==ObjectType.Asteroid.value)
        ))
        
        result.append(z3.Implies(
            celestial[i]==ObjectType.Dwarf.value,
            z3.Not(z3.Or(celestial[left_sector(i)]==ObjectType.PlanetX.value, celestial[right_sector(i)]==ObjectType.PlanetX.value))
        ))
        
        result.append(z3.Implies(
            celestial[i]==ObjectType.GasCloud.value,
            z3.Or(celestial[left_sector(i)]==ObjectType.Empty.value, celestial[right_sector(i)]==ObjectType.Empty.value)
        ))
    
        result.append(z3.Implies(
            celestial[i]==obj1,

        ))
        
    return result




if __name__=="__main__":
    topic=json.loads(sys.argv[1])
    result=json.loads(sys.argv[2])

    print(f"{topic!r}, {result!r}")
    if type(topic)==str:
        print("string")
    elif type(topic)==list:
        print("list")

    # with open('../databases/celestial.json') as f:
    #     celestials=json.load(f)


    # solver=z3.Solver()
    # solver.add(constraints())
    # solver.add()
