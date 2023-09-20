import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import UserEntity from "./UserEntity";
import { setPublicUsers } from "../../redux/actions/accounts";
import { listenForPublicUsers } from "./UsersUtils";

function ProjectTeams(props) {
  const { project } = props;
  const [publicUsers, setUsers] = useState([]);
  listenForPublicUsers(setUsers, props.setPublicUsers);
  if (project.type === "parentProject" && project.structure !== 'Apartments' ) {
    return <div />;
  }
  const users = getProjectUsers(props, publicUsers);
  if (users.length === 0) {
    return <div />;
  }
  return (
    <div
      style={{ marginTop: 40, width: "100%", marginRight: 10, marginLeft: 10 }}
    >
      {users.map(user => (
        <UserEntity
          t={props.t}
          fullDetails
          project={project}
          features={getProjectFeatures(props, user.userId)}
          large
          user={user}
          nameVariant={"h5"}
        />
      ))}
    </div>
  );
}

function getProjectFeatures(props, userId) {
  const { project } = props;
  if (project.management && project.management.user === userId) {
    return project.management.features;
  }
  if (project.constraction && project.constraction.user === userId) {
    return project.constraction.features;
  }
  if (project.entrepreneur && project.entrepreneur.user === userId) {
    return project.entrepreneur.features;
  }
  if (project.projectBank && project.projectBank.user === userId) {
    return project.projectBank.features;
  }

  if (project.projectLawyer && project.projectLawyer.user === userId) {
    return project.projectLawyer.features;
  }

  if (project.projectMarketing && project.projectMarketing.user === userId) {
    return project.projectMarketing.features;
  }
  if (project.trustee && project.trustee.user === userId) {
    return project.trustee.features;
  }
  return "";
}

function getProjectUsers(props, loadedUsers) {
  const { project, publicUsers } = props;
  const projectUsers = loadedUsers.length > 0 ? loadedUsers : publicUsers;
  if (!projectUsers) {
    return [];
  }
  if (projectUsers.length === 0) {
    return [];
  }
  let users = [];
  if (project.trustee) {
    if (project.trustee.user) {
      let trustee = projectUsers.filter(
        user => project.trustee.user === user.userId
      );
      if (trustee.length > 0) {
        users.push(trustee[0]);
      }
    } else {
      let trustee = projectUsers.filter(
        user => project.trustee === user.userId
      );
      if (trustee.length > 0) {
        users.push(trustee[0]);
      }
    }
  }
  if (project.mortgagee) {
    let mortgagee = projectUsers.filter(
      user => project.mortgagee === user.userId
    );
    if (mortgagee.length > 0) {
      users.push(mortgagee[0]);
    }
  }
  if (project.management) {
    let managements = projectUsers.filter(
      user => project.management.user === user.userId
    );
    if (managements.length > 0) {
      users.push(managements[0]);
    }
  }
  if (project.appraisal) {
    let appraisals = projectUsers.filter(
      user => project.appraisal === user.userId
    );
    if (appraisals.length > 0) {
      users.push(appraisals[0]);
    }
  }

  if (project.constraction) {
    let constractions = projectUsers.filter(
      user => project.constraction.user=== user.userId
    );
    if (constractions.length > 0) {
      users.push(constractions[0]);
    }
  }
  if (project.entrepreneur) {
    let entrepreneurs = projectUsers.filter(
      user => project.entrepreneur.user=== user.userId
    );
    if (entrepreneurs.length > 0) {
      users.push(entrepreneurs[0]);
    }
  }

  if (project.projectBank) {
    let projectBanks = projectUsers.filter(
      user => project.projectBank.user=== user.userId
    );
    if (projectBanks.length > 0) {
      users.push(projectBanks[0]);
    }
  }

  if (project.projectMarketing) {
    let projectMarketings = projectUsers.filter(
      user => project.projectMarketing.user=== user.userId
    );
    if (projectMarketings.length > 0) {
      users.push(projectMarketings[0]);
    }
  }

  if (project.projectLawyer) {
    let projectLawyers = projectUsers.filter(
      user => project.projectLawyer.user=== user.userId
    );
    if (projectLawyers.length > 0) {
      users.push(projectLawyers[0]);
    }
  }
  return users;
}

const mapStateToProps = state => {
  return {
    publicUsers: state.userAccounts.publicUUsers
  };
};
const mapDispatchToProps = {
  setPublicUsers
};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(ProjectTeams)
);
