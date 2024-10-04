import sys
import json
import z3
import enum

s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12=z3.Ints('s1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 s12')
celestial = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12]

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

ObjectTypeCountExpert: dict[ObjectType, int] = {
    ObjectType.PlanetX:1,
    ObjectType.Dwarf:4,
    ObjectType.Comet:2,
    ObjectType.Asteroid:4,
    ObjectType.GasCloud: 2,
    ObjectType.Empty:5
}

def constraints():
    
    result=[]
    def left_sector(sector: int):
        return (sector+12-1)%12
        
    def right_sector(sector: int):
        return (sector+1)%12

    #count of each object should be certain value
    for obj in ObjectType:
        result.append(sum(z3.If(i == obj.value, 1, 0) for i in celestial) == ObjectTypeCountStandard[obj])
        
        
    for i in range(12):
        result.append(z3.Implies(
            celestial[i]==ObjectType.Comet.value,
            (i+1) in (2, 3, 5, 7, 11)
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
        
    return result

# topic = [int, int]

# result = {
#     name: "band",
#     atLeast: int, 
#     all: int,
# }

def _left(sector: int):
    return (sector+11)%12
        
def _right(sector: int):
    return (sector+1)%12

def _range(sector: int, _range: int) :
    result: list[int] = []
    for i in range(_range):
        result.append(_left((sector - i + 12) % 12))
        result.append(_right((sector + i) % 12))
    return result

def count(solver: z3.Solver, celestial: list[z3.ArithRef]):
    count=0
    while solver.check() == z3.sat:
        count+=1
        model = solver.model()
        solver.add(z3.Or(
            [x != model[x] for x in celestial]
            )
        )
    return count

if __name__=="__main__":
    topic=json.loads(sys.argv[1])
    result=json.loads(sys.argv[2])
    obj1: int=topic[0]
    obj2: int=topic[1]
    at_least: int=result["distance"]["atLeast"]
    all: int=result["distance"]["all"]

    counts=[]

    solver=z3.Solver()
    solver.add(constraints())
    solver.push()

    #1. n섹터 내에 없다
    for i in range(12):
        solver.add(z3.Implies(
            celestial[i]==obj1,
            sum(z3.If(celestial[i] == obj2, 1, 0) for i in _range(i, at_least-1)) == 0
        ))

    counts.append( count(solver, celestial))

    solver.pop()
    solver.push()
    #2. n섹터 내에 적어도 1개가 있다
    for i in range(12):
        solver.add(z3.Implies(
            celestial[i]==obj1,
            sum(z3.If(celestial[i] == obj2, 1, 0) for i in _range(i, at_least)) > 0
        ))

    counts.append( count(solver, celestial))

    solver.pop()
    solver.push()
    #3. 모두 n섹터 이내에 있다
    for i in range(12):
        solver.add(z3.Implies(
            celestial[i]==obj1,
            sum(z3.If(celestial[i] == obj2, 1, 0) for i in _range(i, all)) == ObjectTypeCountStandard[obj2]
        ))

    counts.append (count(solver, celestial))

    if max(counts)==counts[0]:
        print('''{{{ 
              "name":"range",
              "result":"false",
              "type":"all"
              }}}''')
    elif max(counts)==counts[1]:
        print('''{{{
              "name":"range",
              "result":"true",
              "type":"at-least-one"
              }}}''')
    elif max(counts)==counts[2]:
        print('''{{{
              "name":"range",
              "result":"true",
              "type":"all"
              }}}''')






    