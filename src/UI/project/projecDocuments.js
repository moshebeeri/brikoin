import React from "react";
import PdfViewer from "../pdf/pdfViewer";
import Mizrachi from "../siteIntegrators/mizrachi";
import Leumi from "../siteIntegrators/leumi";

class ProjectDocuments extends React.Component {
  render() {
    const { project } = this.props;
    if (project.type === "parentProject" && project.structure !== 'Apartments') {
      return <div />;
    }
    if (project.structure === "SingleApartment") {
      return this.apartmentDocuments(project);
    }
    if (project.fundingProject) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 800,
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          {project.term && (
            <PdfViewer
              pdf={project.term.pdf}
              title={this.props.t("termsOfUse")}
              description={this.props.t("termsOfUseDesc")}
            />
          )}
          {project.term && (
            <PdfViewer
              pdf={project.term.pdf}
              title={this.props.t("developer")}
              description={this.props.t("developerDesc")}
            />
          )}
          {project.term && (
            <PdfViewer
              pdf={project.term.pdf}
              title={this.props.t("TrusteeAgreement")}
              description={this.props.t("TrusteeAgreementDesc")}
            />
          )}
          {project.term && (
            <PdfViewer
              pdf={project.term.pdf}
              title={this.props.t("ManagementCompany")}
              description={this.props.t("ManagementCompanyDesc")}
            />
          )}
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 800,
          alignItems: "flex-start",
          justifyContent: "center"
        }}
      >
        <div>
          {project.property.term && project.property.term.pdf && (
            <PdfViewer
              pdf={project.property.term.pdf}
              title={this.props.t("termsOfUse")}
              description={this.props.t("termsOfUseDesc")}
            />
          )}
          {project.property.trustee && project.property.trustee.pdf && (
            <PdfViewer
              pdf={project.property.trustee.pdf}
              title={this.props.t("TrusteeAgreement")}
              description={this.props.t("TrusteeAgreementDesc")}
            />
          )}
          {project.property.manager && project.property.manager.pdf && (
            <PdfViewer
              pdf={project.property.manager.pdf}
              title={this.props.t("MangerAgreement")}
              description={this.props.t("MangerAgreementDesc")}
            />
          )}
          {project.property.estimation && project.property.estimation.pdf && (
            <PdfViewer
              pdf={project.property.estimation.pdf}
              title={this.props.t("ProjectEstimationDocument")}
              description={this.props.t("ProjectEstimationDocumentDesc")}
            />
          )}
          {project.property.registrar && project.property.registrar.pdf && (
            <PdfViewer
              pdf={project.property.registrar.pdf}
              title={this.props.t("ProjectRegistrarDocument")}
              description={this.props.t("ProjectRegistrarDesc")}
            />
          )}
          {project.property && project.property.pdf && (
            <PdfViewer
              pdf={project.property.pdf}
              title={this.props.t("ProjectPropertyDocument")}
              description={this.props.t("ProjectPropertyDesc")}
            />
          )}
          {project.property.constraction && (project.property.constraction.pdf || project.property.constraction.document) && (
            <PdfViewer
              pdf={project.property.constraction.pdf || project.property.constraction.document}
              title={this.props.t("ConstructiontDocument")}
              description={this.props.t("ConstructionDesc")}
            />
          )}
          {project.property.entrepreneur && (project.property.entrepreneur.pdf || project.property.entrepreneur.document)&& (
            <PdfViewer
              pdf={project.property.entrepreneur.pdf|| project.property.entrepreneur.document}
              title={this.props.t("entrepreneurDocument")}
              description={this.props.t("entrepreneurDesc")}
            />
          )}

        </div>
      </div>
    );
  }

  apartmentDocuments(project) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 800,
          alignItems: "flex-start",
          justifyContent: "flex-start"
        }}
      >
        {project.property.estimation.document && (
          <PdfViewer
            pdf={project.property.estimation.document}
            title={this.props.t("EstimationDocument")}
            description={this.props.t("ProjectEstimationDocumentDesc")}
          />
        )}
        {project.property.planDocument && (
          <PdfViewer
            pdf={project.property.planDocument}
            title={this.props.t("ApartmentPlan")}
            description={this.props.t("ApartmentPlanDesc")}
          />
        )}
        {project.property.registrar.document && (
          <PdfViewer
            pdf={project.property.registrar.document}
            title={this.props.t("RegistrarDocument")}
            description={this.props.t("RegistrarDocumentDesc")}
          />
        )}
        <Mizrachi
          history={this.props.history}
          location={this.props.location}
          t={this.props.t}
        />
        <Leumi
          history={this.props.history}
          location={this.props.location}
          t={this.props.t}
        />
      </div>
    );
  }
}

export default ProjectDocuments;
