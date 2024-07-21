/** @format */

import axios from "axios";
import pubMeta from "../../../../data/spiel-preview-parents.json";
import GameInfo from "@/app/components/GameInfo";
import Modal from "../../../components/Modal";

export default async function GameModal({ params: { id } }: { params: { id: string } }) {
  const game: Entry = await axios({
    url: "http://localhost:4000/graphql",
    method: "POST",
    data: {
      query: `
        query ($id: String) {
          entry (id: $id) {
            objectid
            msrp
            showprice
            pretty_availability_status
            publishers {
              item {
                objectid
                href
                primaryname {
                  name
                }
              }
            }
            reactions {
              thumbs
            }
            version {
              item {
                objectid
                releasedate
                overridedate
              }
            }
            geekitem {
              item {
                href
                subtypes
                yearpublished
                releasestatus
                minplayers
                maxplayers
                minplaytime
                maxplaytime
                minage
                links {
                  boardgamedesigner {
                    objectid
                    name
                    canonical_link
                  }
                  boardgamefamily {
                    objectid
                    name
                  }
                  reimplements {
                    objectid
                    name
                    canonical_link
                  }
                  boardgamecategory {
                    name
                  }
                  boardgamemechanic {
                    name
                  }
                  boardgameversion {
                    objectid
                    name
                  }
                }
                primaryname {
                  nameid
                  name
                }
                dynamicinfo {
                  item {
                    stats {
                      avgweight
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { id: id },
    },
  })
    .then((result) => {
      return result.data.data.entry;
    })
    .catch((error) => {
      return error;
    });

  return (
    <Modal title={game.geekitem.item.primaryname.name}>
      <div className="z-10 w-full justify-between font-mono text-sm lg:flex lg:gap-8">
        <div className="">
          <GameInfo game={game} />
        </div>
      </div>
    </Modal>
  );
}
