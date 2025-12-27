import argparse
from sqlmodel import Session
from app.db.cruds.system_setting_crud import SystemSettingCrud
from app.db.cruds.team_crud import TeamCrud
from app.db.db import engine
from app.db.seeds import guest_seed, system_setting_seed, team_seed


parser = argparse.ArgumentParser()
parser.add_argument("--mode", default="")


def main(mode: str = ""):
    BOS = "\033[92m"
    EOS = "\033[0m"
    print(f"{BOS}Seeding data...{EOS}")
    with Session(engine) as session:
        SystemSettingCrud(session).delete_items()
        TeamCrud(session).delete_items()
        system_setting_seed.seed(session)
        team_seed.seed(session)
        guest_seed.seed(session)

    print(f"{BOS}Done!{EOS}")


if __name__ == "__main__":
    args = parser.parse_args()
    main(mode=args.mode)
